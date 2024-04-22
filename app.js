const express = require("express")
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config();

app.set("view engine", "ejs");
app.use("/static", express.static('static'));
const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'strict'
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
});

app.get('/e-learning',(req,res)=>{
    if (!req.session.isLogged) {
        return res.redirect('/login');
    }
    res.render('e-learning')
})

const User = require('./model/UsersModel')
const Feedback = require('./model/FeedbackModel')

const apply = require('./routes/ApplyRoute')
const feedback = require('./routes/FeedbackRoute')
const ApplyErasmus = require('./routes/ApplyErasmusRoute')
const login = require('./routes/LoginRoute')
app.use('/apply',apply)
app.use('/feedback',feedback)
app.use('/apply-erasmus',ApplyErasmus)
app.use('/login',login)

const routes = [
    { path: '/', view: 'home' },
    { path: '/change-pw', view: 'change-pw' },
    { path: '/confirm-change', view: 'confirm-change' },
    { path: '/about-us', view: 'aboutus' },
    { path: '/accreditation', view: 'accreditation' },
    { path: '/international-awards', view: 'international-awards' },
    { path: '/erasmus', view: 'erasmus' },
    { path: '/transfer', view: 'transfer' },
    { path: '/arrivals', view: 'arrivals' },
    { path: '/e-library', view: 'e-library' },
    { path: '/clubs', view: 'clubs' },
    { path: '/clubs/football', view: 'football' },
    { path: '/clubs/basketball', view: 'basketball' },
    { path: '/bachelor', view: 'bachelor' },
    { path: '/master', view: 'master' },
    { path: '/college', view: 'college' },
    { path: '/computer-science', view: 'computerscience' },
    { path: '/cyber', view: 'cyber' },
    { path: '/law-school', view: 'law-school' },
    { path: '/workat-uus', view: 'workat-uus' },
    { path: '/ourpartners', view: 'ourpartners' },
    { path: '/contactus', view: 'contact-us' }
];

routes.forEach(route => {
    app.get(route.path, (req, res) => {
        res.render(route.view);
    });
});
app.get('*', (req, res) => {
    res.render('error');
});
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.clearCookie('rememberToken');
        res.redirect('/login');
    });
});




app.listen(process.env.PORT, ()=>{
    console.log('Ready!')
})
