var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/login', function (req, res) {
	
   //var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
   let user = {
    username : req.body.username,
    password : req.body.password
  };
  
  if(user.username === config.username && user.password === config.password){
	  	  
	const payload = {
      id: user.username
    };
	var token = jwt.sign(payload, config.secret, {
      expiresIn: 86400
    });
    res.status(200).send({ auth: true, token: token });
  }
  else{
	res.status(401).json({ message: 'Authentication failed.' });  
  }
   
})

app.get('/getRoster', (req, res) => {
   var token = req.headers['authorization'];
   if (!token) {
		res.status(401).send({ auth: false, message: 'No token provided.' });
	}
	
   token = token.replace('Bearer ', '');

	jwt.verify(token, config.secret, function(err, decoded) {		
		if (err) {
			res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
		}
		else{
			if(decoded.id){
				console.log('authentication succeeded');
			}
			else{
				console.log('authentication failed');
			}
		}
	});
  
})

app.post('/updateRoster', (req, res) => {
   
})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

