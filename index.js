var express = require('express');
var app = express();
var port = process.env.PORT || 4000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var exphbs  = require('express-handlebars');
// var configDB = require('./config/urlConfig.js');
// require('./config/passport')(passport);
//middlewares
app.use(express.static('public'))
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// required for passport
app.use(session({ secret: 'bingo',saveUninitialized: true,resave:false })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// configuration ===============================================================
// mongoose.connect('mongodb://cool:cool@ds159926.mlab.com:59926/scraping', { useMongoClient: true }); // connect to our database
// mongoose.Promise = global.Promise;

 // load our routes and pass in our app and fully configured passport
//  require('./routes.js')(app);
app.get('/', function (req, res) {
    res.render('profile');
});

app.listen(port);