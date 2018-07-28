var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
var express = require('express');
var cors = require('cors');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/login', function(req, res) {

    //var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    let user = {
        username: req.body.username,
        password: req.body.password
    };

    if (user.username === config.username && user.password === config.password) {

        const payload = {
            id: user.username
        };
        var token = jwt.sign(payload, config.secret, {
            expiresIn: 86400
        });
        res.status(200).send({ auth: true, token: token });
    } else {
        res.status(401).json({ message: 'Authentication failed.' });
    }

})

app.get('/getRoster', (req, res) => {
    var readRoster = () => {
        fs.readFile('roster.json', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(data);
            res.end();
        })
    };

    handleAuthtentication(req, res, readRoster);
})

app.post('/updateRoster', (req, res) => {
    var saveRoster = () => {
        console.log(req.body);
        fs.writeFile("roster.json", JSON.stringify(req.body), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("roster saved");
        });
    };

    handleAuthtentication(req, res, saveRoster);
})

function handleAuthtentication(req, res, callback) {
    var token = req.headers['authorization'];
    console.log(token);
    if (!token) {
        res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    token = token.replace('Bearer', '').trim();
    console.log(token);

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            res.status(500).send({ auth: false, message: 'Failed to authenticate token.' + err });
        } else {
            if (decoded.id) {
                callback();
            } else {
                res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); //TODO: change to internal Error 400
            }
        }
    });
}


var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})