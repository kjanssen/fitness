var express    = require('express');
var connect    = require('connect');
var mysql      = require('mysql');
var ejs        = require('ejs');
var dateformat = require('dateformat');
var routes  = require('./controller/index');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'node',
    password: 'node_pass',
    database: 'fitness'
});

var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static(__dirname + '/public'));

app.get('/createuser', function(req, res) {
    res.render('createuser');
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
    connection.query('SELECT ID, Username, Password FROM user WHERE Username=' + connection.escape(req.body.username) +
                     ' AND Password=' + connection.escape(req.body.password) + ';',
                     function(err, result) {
                         console.log(err);
                         console.log(result);
                         if (result.length > 0) {

                             var query = 'SELECT ID, Date, TimeOfDay, Location FROM workout WHERE UserID=' +
                                 connection.escape(result[0].ID) + ';';

                             connection.query(query, function(err, result2) {
                                 console.log(err);
                                 console.log(result2);
                                 for (var i = 0; i < result2.length; i++)
                                    result2[i].Date = dateformat(result2[i].Date, 'm/d/yy');

                                 res.render('userhome', {user: result[0], workouts: result2});
                             });
                         } else
                             res.render('index', {message: 'Username or Password not correct'});
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

app.use('/', routes);

var server = app.listen(1337, function() {
    console.log('Listening on port %d', server.address().port);
});