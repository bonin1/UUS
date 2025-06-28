const ChangeRequestService = require('../../service/ChangeRequest/LoginChangeRequest');
const { createAuditLog } = require('../../helpers/AuditHelper');
const { ACTIONS, STATUS } = require('../../utils/Constrants');
const { getUserFromToken } = require('../../middleware/GetAdminTokenId');

exports.viewChangeRequests = async (req, res) => {
    try {
        console.log('Attempting to get user from token...');
        console.log('Available cookies:', Object.keys(req.cookies || {}));
        
        const user = await getUserFromToken(req);
        console.log('User retrieved successfully:', user.id, user.role);
        
        const changeRequests = await ChangeRequestService.getAllChangeRequests({
            status: req.query.status,
            type: req.query.type
        }, user);

        res.render('change-request', { 
            changeRequests,
            userRole: user.role,
            currentUser: user,
            filters: {
                status: req.query.status,
                type: req.query.type
            },
            currentDateTime: new Date().toISOString(),
            currentUserLogin: user.login,
            formatDate: (date) => new Date(date).toLocaleString(),
            helpers: {
                highlightChanges: (oldValue, newValue) => {
                    if (oldValue === newValue) return oldValue;
                    return `<span class="text-danger">${oldValue}</span> → <span class="text-success">${newValue}</span>`;
                }
            }
        });
    } catch (error) {
        console.error('Error fetching change requests:', error);
        req.flash('error', 'Failed to fetch change requests');
        res.status(500).send('Internal server error');
    }
};

exports.handleChangeRequest = async (req, res) => {
    const { requestId } = req.params;
    const { action, adminReason } = req.body;
    
    try {
        const performer = await getUserFromToken(req);

        const result = await ChangeRequestService.handleChangeRequest(
            requestId,
            action,
            adminReason,
            performer,
            req
        );

        req.flash('success', result.message);
        res.redirect('/admin/change-requests');

    } catch (error) {
        console.error('Error handling change request:', error);
        
        await createAuditLog({
            userId: req.params.userId,
            action: ACTIONS.APPROVE_CHANGE_REQUEST,
            performer: req.user,
            req,
            details: {
                requestId,
                error: error.message,
                attemptedAt: new Date().toISOString(),
                userLogin: req.user?.login || 'bonin1'
            },
            status: STATUS.FAILURE
        });

        req.flash('error', error.message);
        res.redirect('/admin/change-requests');
    }
};


exports.handleBulkChangeRequests = async (req, res) => {
    const { requestIds, action, adminReason } = req.body;
    
    const ids = Array.isArray(requestIds) ? requestIds : [requestIds];
    
    if (!ids || ids.length === 0) {
        req.flash('error', 'No requests selected for bulk action');
        return res.redirect('/admin/change-requests');
    }

    try {
        const performer = await getUserFromToken(req);
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const requestId of ids) {
            try {
                await ChangeRequestService.handleChangeRequest(
                    requestId,
                    action,
                    adminReason,
                    performer,
                    req
                );
                successCount++;
            } catch (error) {
                errorCount++;
                errors.push(`Request ${requestId}: ${error.message}`);
                
                await createAuditLog({
                    userId: performer.id,
                    action: ACTIONS.BULK_CHANGE_REQUEST,
                    performer,
                    req,
                    details: {
                        requestId,
                        error: error.message,
                        attemptedAt: new Date().toISOString(),
                        userLogin: performer.login
                    },
                    status: STATUS.FAILURE
                });
            }
        }

        await createAuditLog({
            userId: performer.id,
            action: ACTIONS.BULK_CHANGE_REQUEST,
            performer,
            req,
            details: {
                totalRequests: ids.length,
                successCount,
                errorCount,
                action,
                processedAt: new Date().toISOString(),
                userLogin: performer.login
            },
            status: errorCount === 0 ? STATUS.SUCCESS : STATUS.PARTIAL_SUCCESS
        });

        if (errorCount > 0) {
            req.flash('warning', `Processed ${successCount} requests successfully. ${errorCount} requests failed.`);
            req.flash('error', errors.join('\n'));
        } else {
            req.flash('success', `Successfully processed ${successCount} requests.`);
        }
        
    } catch (error) {
        console.error('Error in bulk processing:', error);
        req.flash('error', 'Failed to process bulk action: ' + error.message);
    }

    res.redirect('/admin/change-requests');
};