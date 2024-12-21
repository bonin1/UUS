const User = require('../../../model/UsersModel');
const Login = require('../../../model/LoginModel');
const AuditLog = require('../../../model/AuditLog');
const bcrypt = require('bcryptjs');
const ChangeRequest = require('../../../model/ChangeRequest');

const { getUserFromToken } = require('../../../middleware/GetAdminTokenId');
const { createAuditLog } = require('../../../helpers/AuditHelper');
const { handleLoginUpdateRequest } = require('../../../service/LoginManagement');
const { ACTIONS, STATUS, ROLES } = require('../../../utils/Constrants');

exports.DeleteLoginInformation = async (req, res) => {
    const userId = req.params.id;
    try {
        const login = await Login.findOne({
            where: { user_id: userId }
        });

        if (login) {
            await login.destroy();

            const performer = await getUserFromToken(req);

            await AuditLog.create({
                user_id: userId,
                action: 'DELETE_LOGIN',
                performed_by: performer.id,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                details: { userId },
                status: 'SUCCESS'
            });
        }

        res.redirect(`/admin/logininformation/${userId}`);
    } catch (error) {
        console.error(error);

        const performer = await getUserFromToken(req);

        await AuditLog.create({
            user_id: userId,
            action: 'DELETE_LOGIN',
            performed_by: performer.id, 
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            details: { userId },
            status: 'FAILURE',
            error_message: error.message
        });

        res.status(500).send('Internal server error');
    }
};



exports.CreateLoginInformation = async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).send('Email is required.');
        }

        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'lastname', 'dep_id', 'role', 'email', 'phone_number', 'address']
        });

        const hashPassword = await bcrypt.hash(password, 8);

        const [login, created] = await Login.findOrCreate({
            where: { user_id: userId },
            defaults: {
                email: email,
                password: hashPassword
            }
        });

        if (!created) {
            await login.update({
                email: email,
                password: hashPassword
            });
        }

        const performer = await getUserFromToken(req);

        await AuditLog.create({
            user_id: userId,
            action: created ? 'CREATE_LOGIN' : 'UPDATE_LOGIN',
            performed_by: performer.id, 
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            details: { email },
            status: 'SUCCESS'
        });

        res.redirect(`/admin/logininformation/${userId}`);
    } catch (error) {
        console.error(error);

        const performer = await getUserFromToken(req);

        await AuditLog.create({
            user_id: req.params.id,
            action: 'CREATE_LOGIN',
            performed_by: performer.id, 
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            details: { email: req.body.email },
            status: 'FAILURE',
            error_message: error.message
        });

        res.status(500).send('Internal server error');
    }
};


exports.UpdateLoginInformation = async (req, res) => {
    const userId = req.params.id;
    const { email, reason } = req.body;
    let performer;

    try {
        performer = await getUserFromToken(req);
        
        if (performer.role !== ROLES.ADMIN) {
            await handleLoginUpdateRequest({ 
                userId, 
                email, 
                performer, 
                req, 
                reason 
            });
            req.flash('info', 'Change request submitted for admin approval');
        } else {
            await handleLoginUpdateRequest({ 
                userId, 
                email, 
                performer, 
                req, 
                reason 
            });
            req.flash('info', 'Change request created. Please approve through the admin panel.');
        }

        return res.redirect(`/admin/logininformation/${userId}`);

    } catch (error) {
        console.error('Error updating login information:', error);
        
        if (performer) {
            await createAuditLog({
                userId,
                action: ACTIONS.UPDATE_LOGIN,
                performer,
                req,
                details: { email },
                status: STATUS.FAILURE,
                errorMessage: error.message
            });
        }

        return res.status(500).send('Internal server error');
    }
};