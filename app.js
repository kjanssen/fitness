var express = require('express');
var connect = require('connect');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'node',
    password: 'node_pass',
    database: 'fitness'
});

var app = express();
app.use(connect.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/createuser', function(req, res) {
    res.sendfile(__dirname + '/createuser.html');
});

app.post('/', function(req, res) {
    console.log(req.body);
    connection.query('SELECT Username, Password FROM user WHERE Username=' + connection.escape(req.body.username) +
		     ' AND Password=' + connection.escape(req.body.password) + ';',
		     function(err, result) {
			 console.log(err);
			 console.log(result);
			 if (result.length > 0) {
			     res.send('Username and Password correct for user ' + result[0].Username);
			 } else
			     res.send('Username or Password not correct');
		     });
});

app.post('/createuser', function(req, res) {
    console.log(req.body);
    connection.query('INSERT INTO user (Username, Password) VALUES (' + connection.escape(req.body.username) +
		     ', ' + connection.escape(req.body.password) + ');',
		     function(err, result) {
			 console.log(err);
			 console.log(result);

			 if (err) {
			     if (err.code === 'ER_DUP_ENTRY')
				 res.send('Username already exists.');
			 } else
			     res.send('Created user "' + req.body.username + '"');
		     });
});

var server = app.listen(1337, function() {
    console.log('Listening on port %d', server.address().port);
});