const express = require("express")
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config();
const flash = require('connect-flash');
const {sequelize , Op, Model} = require('sequelize')
const multer = require('multer');
const fs = require('fs')
const session = require('express-session');

app.set("view engine", "ejs");
app.use("/static", express.static('static'));


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


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }
});


app.post('/upload', function(req, res) {
    if (!req.files) {
        console.log('No files uploaded');
    } else {
        req.files.forEach(file => {
            console.log(file);
            const image = {
                name: file.originalname,
                data: fs.readFileSync(file.path)
            }
        });
    }
});



const User = require('./model/UsersModel')
const Feedback = require('./model/FeedbackModel')
const ApplyForm = require('./model/ApplyModel')
const Department = require('./model/DepartmentModel')
const ApplyErasmus = require('./model/applyErasmusModel') 
const UserImage = require('./model/UserImageModel')

app.get('/e-learning',(req,res)=>{
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('e-learning')
})

app.post('/deleteApplyErasmus/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Invalid ID parameter.' });
        }

        const deletedApply = await ApplyErasmus.destroy({ where: { application_id: id} });

        if (!deletedApply) {
            return res.status(404).json({ error: 'ApplyErasmus record not found.' });
        }

        res.redirect('/protected');
    } catch (err) {
        console.error('Error deleting ApplyErasmus record:', err);
        res.status(500).json({ error: 'An error occurred while deleting the record.' });
    }
});

app.post('/register/user', upload.array('files', 10), async (req, res) => {
    const {
        name,
        lastname,
        dep_id,
        role,
        email,
        phone_number,
        address
    } = req.body;
    
    try {
        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            req.session.alert = { type: 'danger', message: 'User already exists' };
            return res.redirect('/protected');
        } else {
            const newUser = await User.create({
                name,
                lastname,
                dep_id,
                role,
                email,
                phone_number,
                address
            });
            req.session.alert = { type: 'success', message: 'User created successfully' };


            try {
                if (req.files) {
                    const imagesPromises = req.files.map(async (file) => {
                        const newImage = {
                            name: file.originalname,
                            data: fs.readFileSync(file.path)
                        };
                        const image = await UserImage.create({
                            user_id: newUser.id,
                            photo_user: newImage.data
                        });
                        await fs.promises.unlink(file.path);
                        return image;
                    });
                    await Promise.all(imagesPromises);
                    return res.redirect('/protected');
                } else {
                    console.log('No files were uploaded.');
                    res.redirect('/protected')
                }
            } catch (err) {
                console.error('Error processing files:', err);
            }
            
        }
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'An error occurred while creating user.' });
    }
});

app.post('/search', async (req, res) => {
    try {
        const query = req.body.query;

        if (query === '') {
            res.send([]);
            return;
        }
        const results = await User.findAll({
            where: {
                name: {
                    [Op.like]: `%${query}%`
                }
            }
        });

        res.send(results);
    } catch (err) {
        console.error(err);
        res.send([]);
    }
});

app.get("/user/:id", async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;

    try {
        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'lastname', 'dep_id', 'role', 'email', 'phone_number', 'address']
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const userImage = await UserImage.findAll({
            where: { user_id: userId },
            attributes: ['photo_user']
        });
        const userDataWithImage = {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            dep_id: user.dep_id,
            role: user.role,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address,
            photo_user: userImage.length > 0 ? userImage[0].photo_user.toString('base64') : null
        };

        res.render('user', { data: userDataWithImage });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});



app.post('/user/edit/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, lastname, dep_id,role,email,phone_number,address } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
    
        user.name = name;
        user.lastname = lastname;
        user.dep_id = dep_id;
        user.role = role;
        user.email = email;
        user.phone_number = phone_number;
        user.address = address;

        await user.save();
    
        res.redirect(`/user/${userId}`);
        } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
});



const apply = require('./routes/ApplyRoute')
const feedback = require('./routes/FeedbackRoute')
const ApplyErasmusRoute = require('./routes/ApplyErasmusRoute')
const login = require('./routes/LoginRoute')
const adminRoutes = require('./routes/AdminRoute');
const protected = require('./routes/ProtectedRoute')
app.use('/apply',apply)
app.use('/feedback',feedback)
app.use('/apply-erasmus',ApplyErasmusRoute)
app.use('/login',login)
app.use('/admin', adminRoutes)
app.use('/protected',protected)



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
