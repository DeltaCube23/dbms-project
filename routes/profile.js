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

    //  VERY VERY IMPORTANT QUERY
    var findID = "with UserStocks(userID,units,stockname) as ( SELECT userID, units,stockname from Transactions natural join User having userID = "+key+") select sum(units)as num_stocks , sum(units)*unitprice as stocksworth, stockname, sector from UserStocks natural join Stocks  group by stockname ;";
    var username ;
    var find_user = "SELECT username from User WHERE userID = " + key + ";"
    dbms.query(find_user , (err,result,feilds)=>{
        if(err) throw err;
        username = result[0].username;
    });
    
    dbms.query(findID, (err, result, fields) => {
        if(err) throw err;
        // console.log(result[0].stockname);

        res.render('profile', {username: username,shares:result, key: key});
    });

});

module.exports = router;