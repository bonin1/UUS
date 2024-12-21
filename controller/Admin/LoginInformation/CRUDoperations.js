const { getUserFromToken } = require('../../../middleware/GetAdminTokenId');
const { ACTIONS } = require('../../../utils/Constrants');
const LoginService = require('../../../service/Login/LoginCreate');


exports.CreateLoginInformation = async (req, res) => {
    const userId = req.params.id;
    const { email, password, reason } = req.body;
    
    try {
        const performer = await getUserFromToken(req);

        const result = await LoginService.handleLoginOperation({
            userId,
            performer,
            operationType: ACTIONS.CREATE_LOGIN,
            data: { email, password },
            req,
            reason
        });

        req.flash('success', result.message);
        return res.redirect(`/admin/logininformation/${userId}`);

    } catch (error) {
        console.error('Error in login creation:', error);
        req.flash('error', error.message);
        return res.redirect(`/admin/logininformation/${userId}`);
    }
};

exports.UpdateLoginInformation = async (req, res) => {
    const userId = req.params.id;
    const { email, password, reason } = req.body;
    
    try {
        const performer = await getUserFromToken(req);

        const result = await LoginService.handleLoginOperation({
            userId,
            performer,
            operationType: ACTIONS.UPDATE_LOGIN,
            data: { email, password },
            req,
            reason
        });

        req.flash('success', result.message);
        return res.redirect(`/admin/logininformation/${userId}`);

    } catch (error) {
        console.error('Error in login update:', error);
        req.flash('error', error.message);
        return res.redirect(`/admin/logininformation/${userId}`);
    }
};

exports.DeleteLoginInformation = async (req, res) => {
    const userId = req.params.id;
    const { reason } = req.body;
    
    try {
        const performer = await getUserFromToken(req);

        const result = await LoginService.handleLoginOperation({
            userId,
            performer,
            operationType: ACTIONS.DELETE_LOGIN,
            data: {},
            req,
            reason
        });

        req.flash('success', result.message);
        return res.redirect('/admin/logininformation');

    } catch (error) {
        console.error('Error in login deletion:', error);
        req.flash('error', error.message);
        return res.redirect(`/admin/logininformation/${userId}`);
    }
};