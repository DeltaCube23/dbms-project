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
    var key = req.params.id;

    var findID = "SELECT * from User WHERE userID = " + key + ";";

    var userID = key;
    var stocks, username, userID;
    dbms.query(findID, (err, result, fields) => { // showing profile page
        if(err) throw err;
        username = result[0].username;
    });

    var stocksQuery = 'SELECT * FROM Stocks;';
    dbms.query(stocksQuery, (err, result, fields) => { // showing drop down menu
        if(err) throw err;
        stocks = result;

        res.render('buy', {userID: userID, username: username, stocks: stocks, statusMessage: ""});
    });
});


router.post('/:id', (req, res) =>{
    // req.body object has your form values
    var key = req.params.id;

    if(isNaN(parseInt(req.body.sharesBought))){ // no option was selected
        res.redirect('/buy/' + key);
        return;
    }

    var sharesBought = parseInt(req.body.sharesBought);
    var chosenStockID = parseInt(req.body.chosenStockID);
    
    var userID = parseInt(req.params.id);
    var stockName, totalPrice;
    var statusMessage = "";
    var username = req.body.username;

    var stockQuery = 
        `SELECT * FROM Stocks
            WHERE stockID = ${chosenStockID};`;

    dbms.query(stockQuery, (err, result, fields) =>{
        if(err) throw err;

        totalPrice = sharesBought*result[0].unitPrice;
        stockName = result[0].stockName;
        var insertQuery = 
            `INSERT INTO Transactions(userID,stockName,units,totalValue,transacted) VALUES
                (${userID}, '${stockName}', ${sharesBought}, ${totalPrice}, NOW());`;
        
        dbms.query(insertQuery, (err2, result2, fields2)=>{ // inserting tuple into transactions
            if(err2) throw err2;
        });

        var allStocksQuery = 'SELECT * FROM Stocks;';
        dbms.query(allStocksQuery, (err2, result2, fields) =>{
            if(err2) throw err2;
            statusMessage = `${sharesBought} Shares of ${stockName} worth ${totalPrice} USD Successfully Bought!`;
            res.render('buy', {userID: userID, username: username, stocks: result2, statusMessage: statusMessage});
        });
    });
});

module.exports = router;