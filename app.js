const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const fs = require('fs');

const sessionConfig = require('./config/session');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/StaticRoutes');

const app = express();

app.set('view engine', 'ejs');

app.use('/static', express.static('static'));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const User = require('./model/UsersModel')
const Feedback = require('./model/FeedbackModel')
const ApplyForm = require('./model/ApplyModel')
const Department = require('./model/DepartmentModel')
const ApplyErasmus = require('./model/applyErasmusModel') 
const UserImage = require('./model/UserImageModel')
const Login = require('./model/LoginModel')
const PartnersModel = require('./model/Partners')
const TasksModel = require('./model/TaskModel')
const AuditLog = require('./model/AuditLog')
const ChangeRequest = require('./model/ChangeRequest')

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
});

app.use('/auth', require('./routes/UserAuthRoute'));
app.use('/user', require('./routes/UserManagement'));
app.use('/admin', require('./routes/AdminRoute'));
app.use('/task', require('./routes/TaskRoute'));
app.use('/e-learning', require('./routes/ElearningRoute'));
app.use('/apply', require('./routes/ApplyRoute'));
app.use('/feedback', require('./routes/FeedbackRoute'));
app.use('/apply-erasmus', require('./routes/ApplyErasmusRoute'));
app.use('/partners', require('./routes/PartnersRoute'));
app.use('/dmis', require('./routes/DmisRoute'));

//temporary
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

routes.setupStaticRoutes(app);

app.get('*', (req, res) => {
    res.render('error');
});

app.use(errorHandler);

module.exports = app;