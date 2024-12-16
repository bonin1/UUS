exports.asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.error('Error:', error);
        
        if (error instanceof ValidationError) {
            return res.status(error.statusCode).render('error', {
                message: error.message
            });
        }

        return res.status(500).render('error', {
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    });
};