const { STATUS } = require('../utils/Constrants');
const { createAuditLog } = require('../helpers/AuditHelper');

const errorHandler = async (err, req, res, next) => {
    console.error('Error:', err);

    if (req.performer) {
        await createAuditLog({
            courseId: req.params.courseId,
            action: req.originalUrl,
            performer: req.performer,
            req,
            details: {
                error: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            },
            status: STATUS.FAILURE,
            errorMessage: err.message
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;