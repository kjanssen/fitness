var express    = require('express');
var connect    = require('connect');
var ejs        = require('ejs');
var index      = require('./controller/index');
var user       = require('./controller/user');
var app        = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static(__dirname + '/public'));
app.use('/', index);
app.use('/user', user);

var server = app.listen(1337, function() {
    console.log('Listening on port %d', server.address().port);
});