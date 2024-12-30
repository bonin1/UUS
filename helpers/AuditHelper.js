const AuditLog = require('../model/AuditLogModel');

exports.createAuditLog = async ({ userId, action, performer, req, details, status, errorMessage = null }) => {
    return AuditLog.create({
        user_id: userId,
        action,
        performed_by: performer.id,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        details,
        status,
        ...(errorMessage && { error_message: errorMessage })
    });
};