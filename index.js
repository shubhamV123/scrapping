var express = require('express');
var app = express();
var port = process.env.PORT || 4000;
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var exphbs  = require('express-handlebars');
// var configDB = require('./config/urlConfig.js');
// require('./config/passport')(passport);
//middlewares
app.use(express.static('public'))
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// required for passport

 require('./routes.js')(app);


app.listen(port);