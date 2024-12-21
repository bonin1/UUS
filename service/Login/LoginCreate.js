const bcrypt = require('bcryptjs');
const Login = require('../../model/LoginModel');
const ChangeRequest = require('../../model/ChangeRequest');
const { createAuditLog } = require('../../helpers/AuditHelper');
const { ACTIONS, STATUS, ROLES } = require('../../utils/Constrants');

class LoginService {
    static async handleLoginOperation({ userId, performer, operationType, data, req, reason }) {
        if (performer.role === ROLES.ADMIN) {
            return this.processDirectChange({ userId, performer, operationType, data, req });
        } else {
            return this.createChangeRequest({ userId, performer, operationType, data, req, reason });
        }
    }

    static async processDirectChange({ userId, performer, operationType, data, req }) {
        const transaction = await Login.sequelize.transaction();
        const currentDateTime = new Date().toISOString();

        try {
            let result;
            switch (operationType) {
                case ACTIONS.CREATE_LOGIN:
                    result = await this.executeCreateLogin({ userId, data, performer, transaction });
                    break;
                case ACTIONS.UPDATE_LOGIN:
                    result = await this.executeUpdateLogin({ userId, data, performer, transaction });
                    break;
                case ACTIONS.DELETE_LOGIN:
                    result = await this.executeDeleteLogin({ userId, performer, transaction });
                    break;
                default:
                    throw new Error('Invalid operation type');
            }

            await createAuditLog({
                userId,
                action: operationType,
                performer,
                req,
                details: {
                    ...data,
                    performedAt: currentDateTime,
                    performerLogin: performer.login || 'bonin1',
                    directChange: true
                },
                status: STATUS.SUCCESS
            });

            await transaction.commit();
            return {
                success: true,
                message: `Login ${operationType.toLowerCase()} completed successfully`,
                data: result
            };

        } catch (error) {
            await transaction.rollback();
            
            await createAuditLog({
                userId,
                action: operationType,
                performer,
                req,
                details: {
                    error: error.message,
                    attemptedAt: currentDateTime,
                    performerLogin: performer.login || 'bonin1',
                    directChange: true
                },
                status: STATUS.FAILURE
            });

            throw error;
        }
    }

    static async executeCreateLogin({ userId, data, performer, transaction }) {
        const existingLogin = await Login.findOne({
            where: { user_id: userId },
            transaction
        });

        if (existingLogin) {
            throw new Error('Login already exists for this user');
        }

        const hashedPassword = await bcrypt.hash(data.password, 8);

        return Login.create({
            user_id: userId,
            email: data.email,
            password: hashedPassword,
            created_at: new Date(),
            created_by: performer.id,
            created_by_login: performer.login || 'bonin1'
        }, { transaction });
    }

    static async executeUpdateLogin({ userId, data, performer, transaction }) {
        const login = await Login.findOne({
            where: { user_id: userId },
            transaction
        });

        if (!login) {
            throw new Error('Login not found');
        }

        const updateData = {
            email: data.email,
            updated_at: new Date(),
            updated_by: performer.id,
            updated_by_login: performer.login || 'bonin1'
        };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 8);
        }

        await login.update(updateData, { transaction });
        return login;
    }

    static async executeDeleteLogin({ userId, performer, transaction }) {
        const deleteCount = await Login.destroy({
            where: { user_id: userId },
            transaction
        });

        if (deleteCount === 0) {
            throw new Error('Login not found');
        }

        return { deleted: true };
    }

    static async createChangeRequest({ userId, performer, operationType, data, req, reason }) {
        const currentDateTime = new Date().toISOString();

        const changeRequest = await ChangeRequest.create({
            user_id: userId,
            requested_by: performer.id,
            requested_by_login: performer.login || 'bonin1',
            change_type: operationType,
            new_data: data,
            status: STATUS.PENDING,
            reason,
            requested_at: currentDateTime
        });

        await createAuditLog({
            userId,
            action: `REQUEST_${operationType}`,
            performer,
            req,
            details: {
                ...data,
                requestedAt: currentDateTime,
                requesterLogin: performer.login || 'bonin1'
            },
            status: STATUS.SUCCESS
        });

        return {
            success: true,
            message: 'Change request submitted for admin approval',
            data: changeRequest
        };
    }
}

module.exports = LoginService;