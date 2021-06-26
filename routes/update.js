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

        res.render('update', {data: result});
    });
})


router.post('/:id', (req, res) => {
    var inc = req.body.chosenStockName;
    var value = parseInt(req.body.sharePrice);

    q2 = `UPDATE Stocks set unitPrice = ${value} where stockName = '${inc}';`;
    console.log(q2);
    dbms.query(q2, (err, result, fields) => {
        if (err) throw err;

        q1 = `Insert into StockPrice (stockName, time, Price) values ('${inc}',NOW(), ${value})`;

        dbms.query(q1, (err, result, fields) => {
            if (err) throw err;
        });

        find = "SELECT * from Stocks;";

        dbms.query(find, (err, answer, field) => {
            if(err) throw err;

            res.render('update', {data: answer});
        });
    });
})

module.exports = router;