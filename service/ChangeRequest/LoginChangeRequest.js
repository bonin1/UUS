const ChangeRequest= require('../../model/ChangeRequestModel');
const User = require('../../model/UsersModel');
const Login = require('../../model/LoginModel');
const { createAuditLog } = require('../../helpers/AuditHelper');
const { ACTIONS, STATUS } = require('../../utils/Constrants');

class ChangeRequestService {
    static async getAllChangeRequests(filters = {}, user) {
        const where = {};
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.type) {
            where.change_type = filters.type;
        }

        const changeRequests = await ChangeRequest.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'requestedBy',
                    attributes: ['name', 'lastname', 'email']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'lastname', 'email']
                },
                {
                    model: User,
                    as: 'approvedBy',
                    attributes: ['name', 'lastname']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const enrichedRequests = await Promise.all(changeRequests.map(async (request) => {
            try {
                let oldData = await this.getOldData(request);
                let newData;

                try {
                    newData = typeof request.new_data === 'string' 
                        ? JSON.parse(request.new_data) 
                        : request.new_data;
                } catch (error) {
                    console.error(`Error parsing new_data for request ${request.id}:`, error);
                    newData = {};
                }

                const changes = this.compareData(oldData, newData);

                return {
                    ...request.toJSON(),
                    oldData,
                    newData,
                    changes,
                    requestedAt: request.createdAt,
                    formattedDate: new Date(request.createdAt).toLocaleString(),
                    statusBadgeClass: this.getStatusBadgeClass(request.status),
                    hasInvalidData: changes.some(change => change.isValid === false)
                };
            } catch (error) {
                console.error(`Error processing request ${request.id}:`, error);
                return {
                    ...request.toJSON(),
                    oldData: {},
                    newData: {},
                    changes: [],
                    requestedAt: request.createdAt,
                    formattedDate: new Date(request.createdAt).toLocaleString(),
                    statusBadgeClass: this.getStatusBadgeClass(request.status),
                    hasInvalidData: true
                };
            }
        }));

        return enrichedRequests;
    } catch (error) {
        console.error('Error in getAllChangeRequests:', error);
        throw error;
    }

    static async getOldData(changeRequest) {
        const login = await Login.findOne({
            where: { user_id: changeRequest.user_id },
            attributes: ['email']
        });

        return login ? { email: login.email } : { email: 'N/A' };
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static compareData(oldData, newData) {
        const changes = [];
        
        oldData = oldData || {};
        newData = newData || {};

        try {
            if (newData.email) {
                if (!this.validateEmail(newData.email)) {
                    changes.push({
                        field: 'email',
                        oldValue: oldData.email || 'Not set',
                        newValue: 'Invalid email format',
                        originalValue: newData.email,
                        type: 'modified',
                        isValid: false
                    });
                } else if (oldData.email !== newData.email) {
                    changes.push({
                        field: 'email',
                        oldValue: oldData.email || 'Not set',
                        newValue: newData.email,
                        type: 'modified',
                        isValid: true
                    });
                }
            }

            if (newData.password) {
                changes.push({
                    field: 'password',
                    oldValue: '••••••••',
                    newValue: '••••••••',
                    type: 'modified',
                    isValid: true
                });
            }

            return changes;
        } catch (error) {
            console.error('Error in compareData:', error);
            return [];
        }
    }

    static getStatusBadgeClass(status) {
        const statusClasses = {
            [STATUS.PENDING]: 'badge-warning',
            [STATUS.APPROVED]: 'badge-success',
            [STATUS.REJECTED]: 'badge-danger'
        };
        return statusClasses[status] || 'badge-secondary';
    }

    static async handleChangeRequest(requestId, action, adminReason, performer, req) {
        const transaction = await ChangeRequest.sequelize.transaction();

        try {
            const changeRequest = await ChangeRequest.findByPk(requestId);
            this.validateChangeRequest(changeRequest, action, adminReason);

            const newData = typeof changeRequest.new_data === 'string' 
                ? JSON.parse(changeRequest.new_data) 
                : changeRequest.new_data;

            const status = action === 'approve' ? STATUS.APPROVED : STATUS.REJECTED;

            await changeRequest.update({
                status,
                approved_by: performer.id,
                approved_at: new Date(),
                adminReason,
                approved_by_login: performer.login 
            }, { transaction });

            if (status === STATUS.APPROVED) {
                await this.processApprovedRequest(changeRequest, newData, transaction);
            }

            await createAuditLog({
                userId: changeRequest.user_id,
                action: status === STATUS.APPROVED ? ACTIONS.APPROVE_CHANGE_REQUEST : ACTIONS.REJECT_CHANGE_REQUEST,
                performer,
                req,
                details: {
                    requestId,
                    changeType: changeRequest.change_type,
                    newData,
                    status,
                    adminReason,
                    approvedAt: new Date().toISOString(),
                    approverLogin: performer.login
                },
                status: STATUS.SUCCESS
            });

            await transaction.commit();
            return { success: true, message: `Change request ${status.toLowerCase()} successfully` };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static validateChangeRequest(changeRequest, action, adminReason) {
        if (!changeRequest) {
            throw new Error('Change request not found');
        }
        if (changeRequest.status !== STATUS.PENDING) {
            throw new Error('This request has already been handled');
        }
        if (!['approve', 'reject'].includes(action)) {
            throw new Error('Invalid action specified');
        }
        if (!adminReason) {
            throw new Error('Admin reason is required');
        }
    }

    static async processApprovedRequest(changeRequest, newData, transaction) {
        switch (changeRequest.change_type) {
            case ACTIONS.UPDATE_LOGIN:
                await this.handleLoginUpdate(changeRequest, newData, transaction);
                break;
            case ACTIONS.CREATE_LOGIN:
                await this.handleLoginCreate(changeRequest, newData, transaction);
                break;
            case ACTIONS.DELETE_LOGIN:
                await this.handleLoginDelete(changeRequest, transaction);
                break;
            default:
                throw new Error('Invalid change type');
        }
    }

    static async handleLoginUpdate(changeRequest, newData, transaction) {
        if (!newData.email) {
            throw new Error('New email is missing from change request data');
        }

        if (!this.validateEmail(newData.email)) {
            throw new Error('Invalid email format');
        }

        const [updateCount] = await Login.update(
            { email: newData.email },
            { 
                where: { user_id: changeRequest.user_id },
                transaction
            }
        );

        if (updateCount === 0) {
            throw new Error('Failed to update login information');
        }

        const verifyUpdate = await Login.findOne({
            where: { user_id: changeRequest.user_id },
            transaction
        });

        if (!verifyUpdate || verifyUpdate.email !== newData.email) {
            throw new Error('Update verification failed');
        }
    }

    static async handleLoginCreate(changeRequest, newData, transaction) {
        if (!newData.email || !this.validateEmail(newData.email)) {
            throw new Error('Invalid or missing email address');
        }

        const existingLogin = await Login.findOne({
            where: { user_id: changeRequest.user_id },
            transaction
        });

        if (existingLogin) {
            throw new Error('Login already exists for this user');
        }

        await Login.create({
            user_id: changeRequest.user_id,
            email: newData.email,
            password: newData.password,
            created_at: new Date(),
            created_by: changeRequest.requested_by
        }, { transaction });
    }

    static async handleLoginDelete(changeRequest, transaction) {
        const deleteCount = await Login.destroy({
            where: { user_id: changeRequest.user_id },
            transaction
        });

        if (deleteCount === 0) {
            throw new Error('Login record not found');
        }
    }
}

module.exports = ChangeRequestService;