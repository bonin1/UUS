
exports.GetPasswordChangePage = (req,res)=>{
    res.render('change-pw',{successAlert: req.flash('success'), dangerAlert: req.flash('danger')})
};


exports.ConfirmChange = (req, res) => {
    const email = req.session.email;
    res.render('confirm-change', { email , successAlert: req.flash('success'), dangerAlert: req.flash('danger') });
};