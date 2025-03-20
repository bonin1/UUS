
const staticRoutes = [
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
    { path: '/courses', view: 'courses'},
    { path: '/prishtine', view: 'prishtina' },
    { path: '/prizren', view: 'prizren' },
    {  path: '/phd', view: 'phd' },
    { path: '/campus', view: 'campus' },
    { path: '/housing', view: 'housing' },
];

exports.setupStaticRoutes = (app) => {
    staticRoutes.forEach(route => {
        app.get(route.path, (req, res) => {
            res.render(route.view);
        });
    });
};