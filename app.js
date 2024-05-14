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

app.set("view engine", "ejs");
app.use("/static", express.static('static'));

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


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});



app.post('/upload', upload.array('photos', 10), function(req, res) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    if (!req.files || req.files.length === 0) {
        console.log('No files uploaded');
        return res.status(400).send('No files uploaded');
    } else {
        req.files.forEach(file => {
            console.log(file);
            const image = {
                name: file.originalname,
                data: fs.readFileSync(file.path)
            }
        });

        return res.status(200).send('Files uploaded successfully');
    }
});




const User = require('./model/UsersModel')
const Feedback = require('./model/FeedbackModel')
const ApplyForm = require('./model/ApplyModel')
const Department = require('./model/DepartmentModel')
const ApplyErasmus = require('./model/applyErasmusModel') 
const UserImage = require('./model/UserImageModel')
const Login = require('./model/LoginModel')
const PartnersModel = require('./model/Partners')
const TasksModel = require('./model/TaskModel')

app.get('/e-learning',(req,res)=>{
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('e-learning')
})

app.post('/deleteApplyErasmus/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
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
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
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

app.post('/search/partners', async (req, res) => {
    try {
        const query = req.body.query;

        if (query === '') {
            res.send([]);
            return;
        }
        const results = await PartnersModel.findAll({
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

        const images = await UserImage.findAll({
            where: { user_id: userId }
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
            address: user.address
        };

        res.render('user', { data: userDataWithImage ,images ,userImage , successAlert: req.flash('success'), dangerAlert: req.flash('danger') });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post("/user/delete/:id", async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }

    const userId = req.params.id;
    try {

        const login = await User.findOne({
            where: { id: userId }
        });

        if (login) {
            await User.destroy();
        }

        res.redirect(`/user/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/user/edit/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
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
        req.flash('success', 'User got edited successfully!');
        res.redirect(`/user/${userId}`);
        } catch (error) {
        console.error('Error updating user:', error);
        req.flash('danger', 'Error editing User!');
    }
});

app.post('/updateImage/:id', upload.single('file'), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;
    const newImage = {
        name: req.file.originalname,
        data: fs.readFileSync(req.file.path)
    };
    try {
        const image = await UserImage.findByPk(userId);
        if (!image) {
            return res.json({ error: 'Image not found' });
        }
        image.photo_user = newImage.data;
        await image.save();
        await fs.promises.unlink(req.file.path);

        req.flash('success', 'Image updated successfully!');
        res.redirect(`/user/${userId}`);
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Error updating image!');
        res.redirect(`/user/${userId}`);
    }
});
app.delete('/deleteImage/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;
    try {
        const image = await UserImage.findByPk(userId);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }
        await image.destroy();
        req.flash('success', 'Image deleted successfully!');
        res.redirect(`/user/${userId}`);
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Error deleting image!');
        res.redirect(`/user/${userId}`);
    }
});


app.post('/insertImages/:id', upload.array('files', 10), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;
    try {
        const existingImage = await UserImage.findOne({
            where: { user_id: userId }
        });
        if (existingImage) {
            return res.status(400).send('User already has an image. Cannot insert another.');
        }

        const imagesPromises = req.files.map(async (file) => {
            const newImage = {
                name: file.originalname,
                data: fs.readFileSync(file.path)
            };
            const image = await UserImage.create({
                user_id: userId,
                photo_user: newImage.data
            });
            await fs.promises.unlink(file.path);
            return image;
        });
        await Promise.all(imagesPromises);
        req.flash('success', 'Insert is successful!');
        res.redirect(`/user/${userId}`);
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Insert is not successful, try again later!');
        res.redirect(`/user/${userId}`);
    }
});



app.get("/logininformation/:id", async (req, res) => { 
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;
    try {
        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'lastname', 'dep_id', 'role', 'email', 'phone_number', 'address']
        });
        const login = await Login.findOne({
            where: {user_id:userId}
        })
        res.render('logininformation',{data : user, login,  successAlert: req.flash('success'), dangerAlert: req.flash('danger')})
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

app.post("/logininformation/delete/:id", async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }

    const userId = req.params.id;
    try {

        const login = await Login.findOne({
            where: { user_id: userId }
        });

        if (login) {
            await login.destroy();
        }

        res.redirect(`/logininformation/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/logininformation/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    try {
        const userId = req.params.id;
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).send('Email is required.');
        }

        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'name', 'lastname', 'dep_id', 'role', 'email', 'phone_number', 'address']
        });

        const hashPassword = await bcrypt.hash(password, 8);

        const [login, created] = await Login.findOrCreate({
            where: { user_id: userId },
            defaults: {
                email: email,
                password: hashPassword
            }
        });

        if (!created) {
            await login.update({
                email: email,
                password: hashPassword
            });
        }

        res.redirect(`/logininformation/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/logininformation/edit/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;
    const { email } = req.body; 
    try {
        const user_update = await Login.update({
            email: email
        }, {
            where: { user_id: userId }
        });
        req.flash('success','User got edited successfuly!')
        res.redirect(`/logininformation/${userId}`)
    } catch (error) {
        console.log("Error somewhere here: ", error);
        res.status(500).send('Internal server error');
    }
});


app.get('/editpartners/:id', async(req,res)=>{
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;
    try {
        const partner = await PartnersModel.findOne({
            where: { id: userId },
            attributes: ['id','name','countries','open_scolars','level','semester','dep_id','partners_photos']
        });
        if (!partner) {
            return res.status(404).send('Partner not found');
        }
        res.render('editpartners',{data : partner,  successAlert: req.flash('success'), dangerAlert: req.flash('danger')})
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

app.post("/editpartners/delete/:id", async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }

    const userId = req.params.id;
    try {
        const partner = await PartnersModel.findOne({
            where: { id: userId }
        });

        if (!partner) {
            return res.status(404).send('Partner not found');
        }

        await partner.destroy();
        req.session.alert = { type: 'danger', message: 'Partner got deleted successfuly' };
        res.redirect(`/protected`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/createpartners', upload.fields([
    { name: 'photos', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
]), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const {
        name,
        countries,
        open_scolars,
        level,
        semester,
        dep_id
    } = req.body;

    try {
        const existingPartner = await PartnersModel.findOne({
            where: { name: name }
        });

        if (existingPartner) {
            req.session.alert = { type: 'danger', message: 'Partner already exists' };
            return res.redirect('/protected');
        }

        let partnerData = {
            name,
            countries,
            open_scolars,
            level,
            semester,
            dep_id
        };

        if (req.files['photos']) {
            const file = req.files['photos'][0];
            const newImage = {
                name: file.originalname,
                data: fs.readFileSync(file.path)
            };
            partnerData.partners_photos = newImage.data;
            await fs.promises.unlink(file.path);
            req.flash('success', 'Image uploaded successfully!');
        }

        const newPartner = await PartnersModel.create(partnerData);
        req.session.alert = { type: 'success', message: 'Partner created successfully' };
        res.redirect('/protected');
    } catch (error) {
        console.error('Error creating partner:', error);
        req.flash('danger', 'Insert is not successful, try again later!');
        res.redirect('/protected');
    }
});


app.post('/partners/edit/:id', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;
    const { 
        name, 
        countries , 
        open_scolars , 
        level , 
        semester , 
        dep_id } = req.body;
    try {
        const partner = await PartnersModel.findByPk(userId);
        if (!partner) {
            return res.status(404).send('User not found');
        }
        partner.name = name;
        partner.countries = countries;
        partner.open_scolars = open_scolars;
        partner.level = level;
        partner.semester = semester;
        partner.dep_id = dep_id;

        await partner.save();
        req.flash('success', 'Partner got edited successfully!');
        res.redirect(`/editpartners/${userId}`);
        } catch (error) {
        console.error('Error updating user:', error);
        req.flash('danger', 'Error editing Partner!');
    }
});

app.post('/partners/image/:id', upload.single('photo'),async (req,res)=>{
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const userId = req.params.id;
    const newImage = {
        name: req.file.originalname,
        data: fs.readFileSync(req.file.path)
    };
    try {
        const image = await PartnersModel.findByPk(userId);
        if (!image) {
            return res.json({ error: 'Image not found' });
        }
        console.log('New Image Data Size:', newImage.data.length);
        image.partners_photos = newImage.data;
        await image.save();
        await fs.promises.unlink(req.file.path);

        req.flash('success', 'Image updated successfully!');
        res.redirect(`/editpartners/${userId}`);
    } catch (error) {
        console.error(error);
        req.flash('danger', 'Error updating image!');
        res.redirect(`/editpartners/${userId}`);
    }
})


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
            res.redirect('/protected')
        }
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'An error occurred while deleting the task' });
    }
});


const apply = require('./routes/ApplyRoute')
const feedback = require('./routes/FeedbackRoute')
const ApplyErasmusRoute = require('./routes/ApplyErasmusRoute')
const login = require('./routes/LoginRoute')
const adminRoutes = require('./routes/AdminRoute');
const protected = require('./routes/ProtectedRoute');
const Partners = require('./routes/PartnersRoute');
const Change = require('./routes/ChangeRoute');
const Tasks = require('./routes/TaskRoute');
const Dmis = require('./routes/DmisRoute');
app.use('/apply',apply)
app.use('/feedback',feedback)
app.use('/apply-erasmus',ApplyErasmusRoute)
app.use('/login',login)
app.use('/admin', adminRoutes)
app.use('/protected',protected)
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
