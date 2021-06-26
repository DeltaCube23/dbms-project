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
    var key = req.params.id;
    if(key !== '1') {
        return res.redirect('/login');
    }

    find = "SELECT * from Stocks;";

    dbms.query(find, (err, result, fields) => {
        if(err) throw err;

        res.render('control', {data: result});
    });
})

module.exports = router;