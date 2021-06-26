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

    var getMessages = `
        SELECT * FROM Discussion, User
            WHERE User.userID = Discussion.userID;
    `;
    dbms.query(getMessages, (err, result, field) =>{
        if(err) throw err;

        res.render('discussion', {userID: key, messages: result});
    });
})

router.post('/:id', (req, res) =>{
    var key = parseInt(req.params.id);
    var message = req.body.message;

    if(message === ""){
        res.redirect('/discussion/' + key);
        return;
    }

    console.log(message);
    var addRow =
    `
        INSERT INTO Discussion(userID, message, posted) VALUES
            (${key}, '${message}', NOW());
    `;

    dbms.query(addRow, (err, result, field) =>{
        if(err) throw err;
    });

    res.redirect('/discussion/' + key);
})

module.exports = router;