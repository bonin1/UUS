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

app.get('/e-learning', async (req, res) => {
    if (!req.session.isLoggedIn) {
        const rememberToken = req.cookies.rememberToken;
        if (rememberToken) {
            try {
                const decoded = jwt.verify(rememberToken, process.env.JWT_SECRET);
                req.session.isLoggedIn = true;
                req.session.userId = decoded.userId;
            } catch (err) {
                console.error('Invalid or expired remember token:', err);
                return res.redirect('/login');
            }
        } else {
            return res.redirect('/login');
        }
    }
    
    const userId = req.session.userId;
    try {
        const userData = await User.findByPk(userId, {
            include: [{ model: Department }],
        });

        if (!userData) {
            return res.status(404).send('User not found');
        }

        res.render('e-learning', { userData });
    } catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred while fetching user data');
    }
});

app.get('/change-pw',(req,res)=>{
    res.render('change-pw',{successAlert: req.flash('success'), dangerAlert: req.flash('danger')})
})

app.post('/change-password', async (req, res) => {
    try {
        const { email } = req.body;
    
        if (!isEmail(email)) {
            req.flash('danger', 'Email is in wrong format!');
            res.redirect('/change-pw');
        } else {
            const user = await Login.findOne({ where: { email: { [Op.eq]: email } } });
            if (user) {
                req.session.email = email;
                res.redirect('/confirm-change');
            } else {
                req.flash('danger', 'Email is not found!');
                res.redirect('/change-pw');
            }
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/data', (req, res) => {
    fs.readFile('./responses.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.post('/task/delete/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const taskId = req.params.id;

    try {
        const deletedTask = await TasksModel.destroy({ where: { id: taskId } });
        if (deletedTask === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.redirect('/admin/protected')
        }
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'An error occurred while deleting the task' });
    }
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
const Change = require('./routes/ChangeRoute');
const Tasks = require('./routes/TaskRoute');
const Dmis = require('./routes/DmisRoute');
app.use('/apply',apply)
app.use('/feedback',feedback)
app.use('/apply-erasmus',ApplyErasmusRoute)
app.use('/partners',Partners)
app.use('/confirm-change',Change)
app.use('/insertTask',Tasks)
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

app.get('/tasks', async (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    try {
        const tasks = await TasksModel.findAll();
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Unable to fetch tasks at the moment.' });
    }
});


app.get('/calendar', async (req,res)=>{
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    try {
        const tasks = await TasksModel.findAll();
        res.render('Calendar',{ tasks })
    } catch (error) {
        console.log(error)
        res.redirect('/calendar')
    }
})


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
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.clearCookie('rememberToken');
        res.redirect('/login');
    });
});

app.post('/logout/admin', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.clearCookie('rememberToken');
        res.redirect('/admin');
    });
});


app.listen(process.env.PORT, ()=>{
    console.log('Ready!')
})
