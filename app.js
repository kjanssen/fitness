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
app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/createuser', function(req, res) {
    res.sendfile(__dirname + '/createuser.html');
});

app.get('/userhome', function(req, res) {
    res.sendfile(__dirname + '/userhome.html');
});

app.post('/usercheck', function(req, res) {
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

app.post('/userhome', function(req, res) {
    console.log(req.body);
    connection.query('SELECT Username, Password FROM user WHERE Username=' + connection.escape(req.body.username) +
                     ' AND Password=' + connection.escape(req.body.password) + ';',
                     function(err, result) {
                         console.log(err);
                         console.log(result);
                         if (result.length > 0) {
                             res.sendfile(__dirname + '/userhome.html');
                         } else
                             res.send('Username or Password not correct');
                     });
});

app.post('/userworkouts', function(req, res) {
    console.log(req.body);
    connection.query('SELECT ID, Date, TimeOfDay, Location FROM workout;',
                     function(err, result) {
                         console.log(err);
                         console.log(result);
                         if (result.length > 0) {

			     var responseHTML = '<h3>Workouts</h3> <table> <tr>' +
                                 '<th></th><th>Date</th><th>Time of Day</th> <th>Location</th> </tr>';

			     for (var i = 0; i < result.length; i++) {
				 responseHTML += '<tr>' +
				     '<td>' + (i + 1) + '</td><td>' + result[i].Date + '</td><td>' + result[i].TimeOfDay +
				     '</td><td>' + result[i].Location + '</td></tr>';
			     }
			     responseHTML += '</table>';
                             res.send(responseHTML);
                         }
                     });
});

app.post('/userexercises', function(req, res) {
    console.log(req.body);
    connection.query('SELECT Name, Type FROM exercise;',
		     function(err, result) {
			 console.log(err);
			 console.log(result);
			 if (result.length > 0) {
			     var responseHTML = '<h3>Exercises</h3> <select id="select-exercises" name="exercises">';

			     for (var i = 0; i < result.length; i++)
				 responseHTML += '<option value="' + i + '">' + result[i].Name + ', ' + result[i].Type + '</option>';

			     responseHTML += '</select>';
			     res.send(responseHTML);
			 }
		     });
});

var server = app.listen(1337, function() {
    console.log('Listening on port %d', server.address().port);
});