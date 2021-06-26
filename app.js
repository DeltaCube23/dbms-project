var mysql = require('mysql2');

var dbms = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "admin", // Change password for you!!!
    database: "Platform",
    dateStrings: 'date'
});

dbms.connect((err) => {
    //trial query to check connection
    if(err) throw err;
    console.log(">> Successfully connected to Platform Database");
});

//Till here was just connecting to database portfolio

var express = require('express');
var logger = require('morgan');
var bp = require('body-parser');
var getJSON = require('get-json');
var path = require('path');
const { writer } = require('repl');
const { query } = require('express');
var auth = require('./routes/auth');
var add =  require('./routes/add');
var buy = require('./routes/buy');
var control = require('./routes/control');
var discussion = require('./routes/discussion');
var history = require('./routes/history');
var profile = require('./routes/profile');
var quote = require('./routes/quote');
var sell = require('./routes/sell');
var update = require('./routes/update');
var watchlist = require('./routes/watchlist');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(logger('dev'));

app.get('/', (req, res) => {
    res.render('index')
});

app.use('/auth', auth);
app.use('/logout', auth);
app.use('/add', add);
app.use('/buy', buy);
app.use('/control', control);
app.use('/discussion', discussion);
app.use('/history', history);
app.use('/profile', profile);
app.use('/quote', quote);
app.use('/sell', sell);
app.use('/update', update);
app.use('/watchlist', watchlist);

app.listen(4007, () => {
    console.log('server started on port 4007')
});