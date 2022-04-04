

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

var express = require("express");
var app = express();

const path = require('path');

var bodyParser = require("body-parser");
app.use(bodyParser.json());


app.listen(3000);
app.get('/', function (req,res){
    res.sendFile(path.join(__dirname, '/index.html'));
})
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/style.css");
});
app.get('/script.js', function(req, res) {
    res.sendFile(__dirname + "/script.js");
});

console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000");


function my_database(filename) {
    // Conncect to db by opening filename, create filename if it does not exist:
    var db = new sqlite.Database(filename, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the phones database.');
    });
    // Create our phones table if it does not exist already:
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS phones
            (
                id
                INTEGER
                PRIMARY
                KEY,
                brand
                CHAR
            (
                100
            ) NOT NULL,
                model CHAR
            (
                100
            ) NOT NULL,
                os CHAR
            (
                10
            ) NOT NULL,
                image CHAR
            (
                254
            ) NOT NULL,
                screensize INTEGER NOT NULL
                )`);
        db.all(`select count(*) as count
                from phones`, function (err, result) {
            if (result[0].count == 0) {
                db.run(`INSERT INTO phones (brand, model, os, image, screensize)
                        VALUES (?, ?, ?, ?, ?)`,
                    ["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
                console.log('Inserted dummy phone entry into empty database');
            } else {
                console.log("Database already contains", result[0].count, " item(s) at startup.");
            }
        });
    });
    return db;
}



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:63342"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","DELETE,GET,POST,PUT");
    next();
});

// Setting up routes

app.get("/RetrieveAll", function (req, res) {      // GET request for retrieving all the data from the database

    retrieveAll(req, res);


});
app.get("/RetrieveSpecific", function (req, res) {  // GET request for retrieving specific item with and id

    retrieveSpecific(req, res);


});

app.post("/Create", function (req, res) { // POST request to create a item in database

    create(req, res);

});

app.put("/Update", function (req, res) { // PUT request to update one of the items

    update(req, res);

});

app.delete("/Delete", function (req, res) { // DELETE request to delete an item

    deleteInput(req, res);

});

// Callback


function retrieveAll(req, res) {

    var sql = 'SELECT * FROM phones';       // sql code to be executed

    db.all(sql, function (err, rows) {  //

        if (err) {        //if an error occurs returns the error as json to the html body and sets status code to 400

            response_body = res.status(400).json({err});

        }
        if (rows.length == 0) {  //if there is no data in the table return a 404 status code

            response_body = res.status(404).json({message: 'Not found'});

        } else {      // returns the data as json to html body and sets status code 200

            response_body = res.status(200).json({rows});

        }

        return response_body;

    });


}

function retrieveSpecific(req, res) {

    var params = req.body.id;      // retrieves parameters from body
    var sql = 'SELECT * FROM phones WHERE id=?';  //sql code to execute


    db.all(sql, params, function (err, rows) {

        if (err) {        //if an error occurs returns the error as json to the html body and sets status code to 400

            response_body = res.status(400).json({err});

        }
        if (rows.length == 0) {  //if there is no data in the table return a 404 status code

            response_body = res.status(404).json({message: 'Not found'});

        } else {      // returns the data as json to html body and sets status code 200

            response_body = res.status(200).json({rows});

        }

        return response_body;

    });


}

function create(req, res) {

    var params = [req.body.brand, req.body.model, req.body.os, req.body.screensize, req.body.image];   // retrieves parameters from body
    var sql = `INSERT INTO phones (brand, model, os, screensize, image) VALUES (?, ?, ?, ?, ?)`;    //sql code to execute

    db.run(sql, params, function (err, rows) {

        if (err) {        //if an error occurs returns the error as json to the html body and sets status code to 400

            response_body = res.status(400).json({err});

        } else {  // returns a 201 status code if data has been successfully created

            response_body = res.status(201).json({message: 'Created'});

        }

        return response_body;

    });
}

function update(req, res) {

    var params = [req.body.brand, req.body.model, req.body.os, req.body.screensize, req.body.image, req.body.id];     // retrieves parameters from body
    var sql = `UPDATE phones SET brand=?, model=?, os=?, screensize=?, image=? WHERE id = ?`;     //sql code to execute

    db.run(sql, params, function (err, rows) {

        if (err) {    //if an error occurs returns the error as json to the html body and sets status code to 400

            response_body = res.status(400).json({err});

        } else {      // returns a 204 status code if data has been successfully

            response_body = res.status(204).send();

        }

        return response_body;

    });
}

function deleteInput(req, res) {
    var sql;
    var params = req.body.id;  // retrieves parameters from body

    if(params == null){   // if there is no provided id use sql code provided below
        sql = 'DELETE FROM phones';
    }else{ // if there is id use the sql code provided below
        sql = 'DELETE FROM phones WHERE id=?';
    }
      //sql code to execute
    db.run(sql, params, function (err, row) {

        if (err) {  //if an error occurs returns the error as json to the html body and sets status code to 400

            response_body = res.status(400).json({err});

        } else {    // returns a 204 status code if data has been successfully deleted

            response_body = res.status(204).send();

        }

        return response_body;

    });

}


