const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const qs = require('qs');

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
const PartnersModel = require('./model/PartnersModel')
const TasksModel = require('./model/TaskModel')
const AuditLog = require('./model/AuditLogModel')
const ChangeRequest = require('./model/ChangeRequestModel')
const StudyLevel = require('./model/StudyLevelModel')
const Course = require('./model/CoursesModel')
const Enrollment = require('./model/EnrollmentModel')
const Grade = require('./model/GradesModel')
const Semester = require('./model/SemesterModel')
const News = require('./model/NewsModel')
const NewsMedia = require('./model/NewsMedia')
const NewsTag = require('./model/NewsTag')
const ArticleTag = require('./model/ArticleTag')
const NewsCategories = require('./model/NewsCategory')


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
app.use('/professor', require('./routes/ProfessorRoute'));
app.use('/department', require('./routes/UniDepartments'));

app.post('/api/tasks/:id/update', async (req, res) => {
    try {
        const rawDate = new Date(req.body.scheduledTime);
        const scheduledTime = rawDate.toISOString(); 

        const response = await axios({
            method: 'POST',
            url: `http://localhost:8081/api/tasks/${req.params.id}/update`,
            data: qs.stringify({
                taskName: req.body.taskName,
                scheduledTime,
                duration: req.body.duration
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.redirect('/admin/protected');
    } catch (error) {
        console.error('Update error:', error.response?.data || error.message);
        req.flash('error', 'Failed to update task: ' + (error.response?.data?.error || error.message));
        res.redirect('/protected');
    }
});

app.use('/java-api', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `http://localhost:8081${req.path}`,
            data: req.body,
            headers: req.headers
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || error.message);
    }
});

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