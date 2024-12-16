const express = require("express")
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config();
const flash = require('connect-flash');
const {Sequelize , Op, Model, where} = require('sequelize')
const multer = require('multer');
const fs = require('fs')
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use("/static", express.static('static'));

app.use(cookieParser());
app.use(flash());
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

const upload = require('./config/UploadImageConfig');



const User = require('./model/UsersModel')
const Feedback = require('./model/FeedbackModel')
const ApplyForm = require('./model/ApplyModel')
const Department = require('./model/DepartmentModel')
const ApplyErasmus = require('./model/applyErasmusModel') 
const UserImage = require('./model/UserImageModel')
const Login = require('./model/LoginModel')
const PartnersModel = require('./model/Partners')
const TasksModel = require('./model/TaskModel')

const auth = require('./routes/UserAuthRoute')
app.use('/auth',auth)

const userManagement = require('./routes/UserManagement')
app.use('/user',userManagement)

const adminRoutes = require('./routes/AdminRoute');
app.use('/admin', adminRoutes)

const Tasks = require('./routes/TaskRoute');
app.use('/task',Tasks)

const Elearning = require('./routes/ElearningRoute');
app.use('/e-learning',Elearning)


app.get('/data', (req, res) => {
    fs.readFile('./responses.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(JSON.parse(data));
        }
    });
});


app.get('/grades', async(req,res)=>{
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }

    res.render('grades', { successAlert: req.flash('success'), dangerAlert: req.flash('danger')})
})


const apply = require('./routes/ApplyRoute')
const feedback = require('./routes/FeedbackRoute')
const ApplyErasmusRoute = require('./routes/ApplyErasmusRoute')
const Partners = require('./routes/PartnersRoute');
const Dmis = require('./routes/DmisRoute');
app.use('/apply',apply)
app.use('/feedback',feedback)
app.use('/apply-erasmus',ApplyErasmusRoute)
app.use('/partners',Partners)

app.use('/dmis', Dmis)

app.post('/update_status', (req, res) => {
    const { id, status } = req.body; 
    ApplyForm.update({ status: status }, { where: { user_id: id } })
        .then(() => {
        res.sendStatus(200);
        })
        .catch((err) => {
        console.error(err);
        res.sendStatus(500);
        });
});


const routes = [
    { path: '/', view: 'home' },
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
    { path: '/contactus', view: 'contact-us' },
    { path: '/employee', view: 'employee' },
    { path: '/research', view: 'research' },
    { path: '/employment', view: 'emplyment' },
    { path: '/adventures', view: 'adventures' },
    { path: '/studyprograms', view: 'studyprograms' },
    { path: '/courses', view: 'courses'}
];

routes.forEach(route => {
    app.get(route.path, (req, res) => {
        res.render(route.view);
    });
});
app.get('*', (req, res) => {
    res.render('error');
});

app.listen(process.env.PORT, ()=>{
    console.log('Ready!')
})
