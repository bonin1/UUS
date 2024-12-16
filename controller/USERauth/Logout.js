exports.Logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.clearCookie('rememberToken');
        res.redirect('/auth/login');
    });
};

exports.LogoutAdmin = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.clearCookie('authToken'); 
        res.clearCookie('rememberToken'); 
        
        res.redirect('/admin');
    });
};
