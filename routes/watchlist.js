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
    var key = parseInt(req.params.id);

    var query = "SELECT stockname, sector, unitPrice from WatchList inner join Stocks using (stockName) where userID = " + key + ";";
    var findID = "SELECT * from Stocks;";

    dbms.query(query, (err, result, field) => {
        if (err) throw err;

        dbms.query(findID, (err, answer, field) => {
            if (err) throw err;
            
            res.render('watchlist', {key: key, shares: answer, data: result});
        });
    });
})


router.post('/:id', (req, res) => {
    var op = req.body.operation;
    var inc = req.body.chosenStockName;
    var key = parseInt(req.params.id);

    var change;
    if(op == "ADD"){
        change = `INSERT into WatchList (userID, stockName) values (${key}, '${inc}');`;
    } else if(op == "REMOVE"){
        change = `DELETE from WatchList where userID = ${key} and stockName = '${inc}';`;
    }

    if(op == "ADD" || op == "REMOVE"){
        dbms.query(change, (err, answer, field) => {
            if (err) throw err;
        });
    }

    var query = "SELECT stockname, sector, unitPrice from WatchList inner join Stocks using (stockName) where userID = " + key + ";";
    var findID = "SELECT * from Stocks;";

    dbms.query(query, (err, result, field) => {
        if (err) throw err;

        dbms.query(findID, (err, answer, field) => {
            if (err) throw err;
            
            res.render('watchlist', {key: key, shares: answer, data: result});
        });
    });
})

module.exports = router;