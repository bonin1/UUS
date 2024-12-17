const ChangeRequest = require('../../model/ChangeRequest')
const User = require('../../model/UsersModel')
const AuditLog = require('../../model/AuditLog')
const Login = require('../../model/LoginModel');
const { getUserFromToken } = require('../../middleware/GetAdminTokenId');

exports.viewChangeRequests = async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        const changeRequests = await ChangeRequest.findAll({
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

        res.render('change-request', { 
            changeRequests,
            userRole: user.role
        });
    } catch (error) {
        console.error('Error fetching change requests:', error);
        res.status(500).send('Internal server error');
    }
};

exports.handleChangeRequest = async (req, res) => {
    const { requestId } = req.params;
    const { action, adminReason } = req.body;
    
    try {
        const user = await getUserFromToken(req);

        const changeRequest = await ChangeRequest.findByPk(requestId);

        if (!changeRequest) {
            return res.status(404).send('Change request not found');
        }

        const newData = typeof changeRequest.new_data === 'string' 
            ? JSON.parse(changeRequest.new_data) 
            : changeRequest.new_data;

        console.log('Change Request Data:', {
            id: changeRequest.id,
            user_id: changeRequest.user_id,
            new_data: newData
        });

        if (changeRequest.status !== 'PENDING') {
            return res.status(400).send('This request has already been handled');
        }

        const status = action === 'approve' ? 'APPROVED' : 'REJECTED';

        await changeRequest.update({
            status,
            approved_by: user.id,
            approved_at: new Date(),
            adminReason
        });

        if (status === 'APPROVED') {
            const newEmail = newData.email;

            if (!newEmail) {
                throw new Error('New email is missing from change request data');
            }

            const [updateCount] = await Login.update(
                { email: newEmail },
                { 
                    where: { user_id: changeRequest.user_id }
                }
            );

            if (updateCount === 0) {
                throw new Error('Failed to update login information');
            }

            const verifyUpdate = await Login.findOne({
                where: { user_id: changeRequest.user_id }
            });

            if (!verifyUpdate) {
                throw new Error('Login record not found after update');
            }

            if (verifyUpdate.email !== newEmail) {
                throw new Error(`Update verification failed. Expected: ${newEmail}, Got: ${verifyUpdate.email}`);
            }
        }

        await AuditLog.create({
            user_id: changeRequest.user_id,
            action: `${status}_CHANGE_REQUEST`,
            performed_by: user.id,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            details: {
                requestId,
                newEmail: newData.email,
                status: status,
                adminReason: adminReason
            },
            status: 'SUCCESS'
        });

        req.flash('success', `Change request has been ${status.toLowerCase()} and changes have been applied`);
        res.redirect('/admin/change-requests');

    } catch (error) {
        console.error('Error handling change request:', error);
        req.flash('danger', `Error: ${error.message}`);
        res.status(500).send('Internal server error');
    }
};