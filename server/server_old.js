const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectMongoDB = require("./config/mongodb");
const cors = require('cors');
const path = require("path");
const session = require('express-session');
const PORT = process.env.PORT || 3001;
//const passport = require("passport");

//cross origin resources sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use(session({
    secret: 'cmpe295-proj',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

connectMongoDB();

//app.use(passport.initialize());
//require("./config/passport")(passport);

//API routes
app.use(require('./routes/User/user')); 
app.use(require('./routes/Upload/uploadResume'));
app.use(require('./routes/Recommender/recommendJobs'));

app.use(express.static(path.join(__dirname, "../client/build")));
app.listen(PORT, () => console.log('Server listening on port:', PORT));