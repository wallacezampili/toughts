const express = require('express');
const exhbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const conn = require('./db/conn');

const app = express();

//Models
const User = require('./models/User');
const Tought = require('./models/Tought');

//Import Routes
const toughtRoutes = require('./routes/toughtRoutes');
const authRoutes = require('./routes/authRoutes');

//Controller
const ToughtController = require('./controllers/ToughtController');

//Handlebars
app.engine('handlebars', exhbs.engine())
app.set('view engine', 'handlebars');

//Body data settings
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());



//Session
app.use(session({
    name: 'sesssion',
    resave: false,
    secret: 'our_secret',
    saveUninitialized: true,
    store: new FileStore({
        logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
        secure: false,
        maxAge: 360000, 
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}));

//Flash Messages
app.use(flash());

//Public
app.use(express.static('./public'))

//Set session to res
app.use((req, res, next) => {

    if(req.session.userid){
        res.locals.session = req.session
    }

    next()

})


//Routes
app.use('/toughts', toughtRoutes);
app.use('/', authRoutes);
app.get('/', ToughtController.showToughts);

conn.sync().then(() => {
    app.listen(3000);
}).catch(err => console.log(err));