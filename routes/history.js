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

router.get('/:id', (req, res) => {
    //console.log(req.params.id);
    var key = parseInt(req.params.id);

    var findID = "SELECT * from User WHERE userID = " + key + ";";

    dbms.query(findID, (err, result, fields) => {
        if(err) throw err;

        var username = result[0].username;
        var userHistory = "SELECT * from Transactions where userID = " + key + " ORDER BY transactionID DESC LIMIT 5;";

        dbms.query(userHistory, (err, result, fields) => {
            if(err) throw err;
           
            res.render('history', {data: result, username: username, key: key});
        });
    });
});

module.exports = router;