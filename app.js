const express = require("express")
const app = express()
const bodyParser = require('body-parser');

require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.use("/static", express.static('static'));



const routes = [
    { path: '/', view: 'home' },
    { path: '/apply', view: 'apply' },
    { path: '/login', view: 'login' },
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
    { path: '/computer-science', view: 'computerscience' }
];

routes.forEach(route => {
    app.get(route.path, (req, res) => {
        res.render(route.view);
    });
});


app.listen(process.env.PORT, ()=>{
    console.log('Ready!')
})
