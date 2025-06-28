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
        // Clear all possible tokens
        res.clearCookie('authToken'); 
        res.clearCookie('sessionToken'); 
        res.clearCookie('rememberToken'); 
        res.clearCookie('userId');
        
        res.redirect('/admin');
    });
};
