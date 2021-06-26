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

    res.render('add');
})


router.post('/:id', (req, res) => {
    var inc = req.body.symbol;
    var sec = req.body.sector;
    var val = parseInt(req.body.shares);
    q2 = `INSERT into Stocks (stockName, sector, unitPrice) values ('${inc}', '${sec}', ${val});`;

    dbms.query(q2, (err, result, fields) => {
        if (err) throw err;
        q1 = `Insert into StockPrice (stockName, time, Price) values ('${inc}',NOW(), ${val})`;

        dbms.query(q1, (err, result, fields) => {
            if (err) throw err;
        });
        res.render('add');
    });
})

module.exports = router;