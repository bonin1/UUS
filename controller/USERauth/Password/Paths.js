
exports.GetPasswordChangePage = (req,res)=>{
    const token = req.query.token;
    if (!token) {
        return res.send("Invalid token");
    }
    res.render('change-pw',{successAlert: req.flash('success'), dangerAlert: req.flash('danger') , token})
};


exports.ConfirmChange = (req, res) => {
    const email = req.session.email;
    res.render('confirm-change', { email , successAlert: req.flash('success'), dangerAlert: req.flash('danger') });
};