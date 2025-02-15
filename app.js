// main js script for server app

"use strict";

// define modules
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const createError = require('http-errors');
const logger = require('morgan');
const fs = require('fs');
// const flash = require('express-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const serveIndex = require('serve-index');
const zip = require('express-easy-zip');
const dotenv = require('dotenv');

// dotenv.config();
// try{
//     var db_url = process.env.DATABASE_URL
//     var port_env = process.env.PORT
//     var key = process.env.SECRET_KEY
// } catch(err) {
//     dotenv.config();
//     db_url = process.env.DATABASE_URL
//     port_env = process.env.PORT
//     key = process.env.SECRET_KEY
// }

dotenv.config()

var env_var = {}
Object.entries(process.env).forEach(([key, val]) => {
    // 
    if (key.startsWith('DATABASE_URL')) {
        env_var.db_url = val
    } else if (key.startsWith('PORT')){
        env_var.port_env = val
    } else if (key.startsWith('SECRET_KEY')) {
        env_var.key = val
    }
})

// create app variable
const app = express();


// set up port 
const port = env_var.port_env || 8080;

// set up routes
const home = require('./routes/home');
const webhook = require('./routes/webhook');
const sys_info = require('./routes/system_information');
const users = require('./routes/users');
const sharedFolder = require('./routes/shared_folder');

// set body parser
const bodyParser = require('body-parser');

// set boyd parser, view engine and stylesheet
app.set('view engine', 'ejs');
app.use(logger('common', { stream: fs.createWriteStream('./website.log', { flags: 'a' }) }));
app.use(logger('dev'));
// app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public/stylesheets'));
app.use(express.static(__dirname + '/public/static'));
app.use(cookieParser());

// import dotenv to setup database
require('dotenv').config();
const db = require('./db/database');
const { env } = require('process');
const mongoString = env_var.db_url;
db(mongoString);

// config session
const TWO_HOURS = 1000 * 60 * 60 * 2;
app.use(session({
    secret: env_var.key,
    saveUninitialized: false,
    name: 'session',
    cookie: {
        maxAge: TWO_HOURS
    },
    resave: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: 'Home-server',
        collectionName: 'sessions',
        ttl: TWO_HOURS,
        autoRemove: 'native'
    })
}));

// set zip to app
app.use(zip());

// set url routing 
app.use('/', users);
app.use('/home', home);
app.use('/webhook', webhook);
app.use('/sys-info', sys_info);
app.use('/sharedFolder', sharedFolder);

// catch 404 error and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler 
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render error page
    res.status(err.status || 500);
    let errors = {
        err: err.message,
        status: err.status || 500
    }
    res.render('error', { error: errors });
});

let server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log('Press Ctrl+C to stop server');
});
server.setTimeout(500000);