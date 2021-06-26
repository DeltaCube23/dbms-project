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

var express = require('express');
var router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', {message: "", username: ""})
});


router.post('/login', (req, res) => {
    var query = "select userID, password from User where username = \"" + req.body.username + "\";";
    dbms.query(query, (err, result, fields) => {
        if(err) throw err;

        if(result.length == 0) {
            res.render('login', {message: "Invalid Username", username: req.body.username})
        }
        else if(req.body.password != result[0].password) {
            res.render('login', {message: "Wrong Password", username: req.body.username});
        }
        else {
            var travel;
            if(result[0].userID == 1) {
                travel = '/control/' + result[0].userID;
            }
            else {
                travel = '/profile/' + result[0].userID;
            }
            res.redirect(travel);
        }
    });
})

router.get('/register', (req, res) => {
    res.render('register', {message: "", username: ""});
});


router.post('/register', (req, res) => {
    var query = "select username from User where username = \"" + req.body.username + "\";";
    dbms.query(query, (err, result, fields) => {
        if(err) throw err;

        if(result.length == 1) {
            res.render('register', {message: "Username Exists", username: req.body.username});
        }
        else if(req.body.username == "") {
            res.render('register', {message: "Username Empty", username: req.body.username});
        }
        else if(req.body.password == "") {
            res.render('register', {message: "Password Empty", username: req.body.username});
        }
        else if(req.body.password != req.body.confirm_password) {
            res.render('register', {message: "Passwords are different", username: req.body.username});
        }
        else {
            var new_record = "INSERT INTO User(username, password)" + 
                " VALUES(\"" + req.body.username + "\", \"" + req.body.password + "\");";

            dbms.query(new_record, (err, result, fields) => {
                if(err) throw err;

                var findID = "SELECT * from User WHERE username=\"" + req.body.username + "\";";
                dbms.query(findID, (err, result, fields) => {
                    if(err) throw err;
                    
                    var travel = '/profile/' + result[0].userID;
                    res.redirect(travel);
                });
            });
        }
    });
});

router.get('/:id', (req, res) => {
    var key = parseInt(req.params.id);
    res.redirect('/')
})

module.exports = router;