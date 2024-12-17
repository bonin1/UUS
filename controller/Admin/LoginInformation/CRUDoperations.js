const User = require('../../../model/UsersModel');
const Login = require('../../../model/LoginModel');
const AuditLog = require('../../../model/AuditLog');
const bcrypt = require('bcryptjs');
const ChangeRequest = require('../../../model/ChangeRequest');

const { getUserFromToken } = require('../../../middleware/GetAdminTokenId');

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
    const { email } = req.body;
    try {
        const performer = await getUserFromToken(req);
        
        if (performer.role === 'staff') {
            await ChangeRequest.create({
                user_id: userId,
                requested_by: performer.id,
                change_type: 'UPDATE_LOGIN',
                new_data: { 
                    email: email 
                },
                status: 'PENDING',
                reason: req.body.reason 
            });

            await AuditLog.create({
                user_id: userId,
                action: 'REQUEST_UPDATE_LOGIN',
                performed_by: performer.id,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                details: { email },
                status: 'SUCCESS'
            });

            req.flash('info', 'Change request submitted for admin approval');
            return res.redirect(`/admin/logininformation/${userId}`);
        }

        const user_update = await Login.update({
            email: email
        }, {
            where: { user_id: userId }
        });

        await AuditLog.create({
            user_id: userId,
            action: 'UPDATE_LOGIN',
            performed_by: performer.id,
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            details: { email },
            status: 'SUCCESS'
        });

        req.flash('success', 'User got edited successfully!');
        res.redirect(`/admin/logininformation/${userId}`);
    } catch (error) {
        console.log("Error somewhere here: ", error);

        const performer = await getUserFromToken(req);

        await AuditLog.create({
            user_id: userId,
            action: 'UPDATE_LOGIN',
            performed_by: performer.id, 
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
            details: { email },
            status: 'FAILURE',
            error_message: error.message
        });

        res.status(500).send('Internal server error');
    }
};
