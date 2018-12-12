const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const static = express.static(__dirname + "/public");
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var fileupload = require("express-fileupload");
var http = require("http").Server(app);

var session = require('express-session');
var validator = require('express-validator');
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// app.use(bodyParser()); // get information from html forms

const configRoutes = require("./routes");

const exphbs = require("express-handlebars");

const configDB = require('./config/mongoConnection');

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

/*--------------------check for authorization------------------------*/
// app.use(function(req, res, next) {
//     var auth;
//     if (req.headers.authorization) {
//         auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
//     }

//     if (!auth || auth[0] !== 'admin' || auth[1] !== 'admin') {
//         res.statusCode = 401;
//         res.setHeader('WWW-Authenticate', 'Basic realm="Hello"');
//         res.end('Unauthorized');
//     } else {
//         // continue with processing, user was authenticated
//         next();
//     }
// });

// Express Validator
app.use(validator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));



app.use(flash());

<<<<<<< HEAD
=======
/*---------------------------comments-----------------------------*/
// io.on('connection', function (socket) {
//     socket.on('comment', function (data) {
//         var commentData = new Comments(data);
//         commentData.save();
//         socket.broadcast.emit('comment', data);
//     });

// });
>>>>>>> 4becc40517bd6f0173c54aa3d919cf0a4b854362

configRoutes(app);

app.listen(3000, () => {
    console.log("Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it");
    if (process && process.send) process.send({
        done: true
    });
});