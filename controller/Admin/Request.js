const ChangeRequestService = require('../../service/ChangeRequest/LoginChangeRequest');
const { createAuditLog } = require('../../helpers/AuditHelper');
const { ACTIONS, STATUS } = require('../../utils/Constrants');
const { getUserFromToken } = require('../../middleware/GetAdminTokenId');

exports.viewChangeRequests = async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        
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