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

    var findID = "SELECT * from Stocks;";

    dbms.query(findID, (err, result, fields) => {
        if(err) throw err;

        res.render('quote', {key: key, inc: "",unitprice: "", shares: result});
    });
});


router.post('/:id', (req, res) => {
    var query = "SELECT unitprice from Stocks where stockname = \"" + req.body.chosenStockName + "\";";
    var key = parseInt(req.params.id);
    var quantity = parseInt(req.body.stockUnits);
    var inc = req.body.chosenStockName;

    dbms.query(query, (err, result, fields) => {
        if(err) throw err;
        //console.log(result);

        var stockPrice = "select * from StockPrice where stockName = \"" + req.body.chosenStockName +"\" order by time DESC;";

        dbms.query(stockPrice , (err , stockPrices , feilds)=>{

            var findID = "SELECT * from Stocks;";
            console.log(stockPrices);
            dbms.query(findID, (err, answer, fields) => {
                if(err) throw err;

                res.render('quote', {key: key, quantity: quantity, price: result[0].unitprice, inc: inc, shares: answer , sharePrize:stockPrices});
            });
        })
        
    });
})

module.exports = router;