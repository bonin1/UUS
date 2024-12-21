const Login = require('../model/LoginModel');
const ChangeRequest = require('../model/ChangeRequest');
const {createAuditLog} = require('../helpers/AuditHelper');
const { ACTIONS, STATUS } = require('../utils/Constrants');

exports.createChangeRequest = async ({ userId, performer, email, reason }) => {
    return ChangeRequest.create({
        user_id: userId,
        requested_by: performer.id,
        change_type: ACTIONS.UPDATE_LOGIN,
        new_data: { email },
        status: STATUS.PENDING,
        reason
    });
};

exports.updateUserLogin = async (userId, email) => {
    return Login.update(
        { email },
        { where: { user_id: userId }}
    );
};

exports.handleLoginUpdateRequest = async ({ userId, email, performer, req, reason }) => {
    await this.createChangeRequest({ userId, performer, email, reason });
    
    await createAuditLog({
        userId,
        action: ACTIONS.REQUEST_UPDATE_LOGIN,
        performer,
        req,
        details: { email },
        status: STATUS.SUCCESS
    });
};