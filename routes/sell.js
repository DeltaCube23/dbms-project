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
        res.render('sell', {userID: userID, username: username, stocks: stocks, statusMessage: ""});
    });
});


router.post('/:id', (req, res) =>{
    // req.body object has your form values
    var key = req.params.id;

    if(isNaN(parseInt(req.body.sharesSold))){ // no option was selected
        res.redirect('/sell/' + key);
        return;
    }

    var sharesSold = parseInt(req.body.sharesSold);
    var chosenStockID = parseInt(req.body.chosenStockID);
    
    var userID = parseInt(req.params.id);
    var stockName, totalPrice;
    var statusMessage = "";
    var username = req.body.username;

    var allStocksQuery = `SELECT * FROM Stocks;`;
    var stockQuery = 
        `SELECT * FROM Stocks
            WHERE stockID = ${chosenStockID};`;
    
    

    dbms.query(stockQuery, (err, result, fields) =>{
        if(err) throw err;

        totalPrice = sharesSold*result[0].unitPrice;
        stockName = result[0].stockName;

        var sumOfSharesQuery = 
        `SELECT SUM(units) as sum FROM Transactions 
            WHERE userID = ${userID} AND stockName = '${stockName}';`;

        dbms.query(sumOfSharesQuery, (err2, result2, fields2) =>{
            //console.log(sumOfShares);
            //console.log(result2);
            //console.log(sumOfSharesQuery);
            if(err2) throw err2;
            var sumOfShares = parseInt(result2[0].sum);

            
            if(isNaN(sumOfShares)  || sumOfShares < sharesSold){ // 0 stocks or less than required
                statusMessage = `You do not have so many stocks to sell. Try again`;
                
                dbms.query(allStocksQuery, (err3, result3, fields3) => { // showing drop down menu
                    if(err3) throw err3;
                    
                    res.render('sell', {userID: userID, username: username, stocks: result3, statusMessage: statusMessage});
                });
                return;
            }

            var insertQuery = 
                `INSERT INTO Transactions(userID,stockName,units,totalValue,transacted) VALUES
                    (${userID}, '${stockName}', -${sharesSold}, -${totalPrice}, NOW());`; // 2 '-' to indicate minus
            
            dbms.query(insertQuery, (err3, result3, fields3)=>{ // inserting tuple into transactions
                if(err3) throw err3;
            });

           
            dbms.query(allStocksQuery, (err3, result3, fields3) => { // showing drop down menu
                if(err3) throw err3;
                
                statusMessage = `${sharesSold} Shares of ${stockName} worth ${totalPrice} USD Successfully Sold!`;
                res.render('sell', {userID: userID, username: username, stocks: result3, statusMessage: statusMessage});
            });
        });
    });
});

module.exports = router;