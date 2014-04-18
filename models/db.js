var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'node',
    password: 'node_pass',
    database: 'fitness'
});

exports.CheckUser = function(username, password, callback) {

    var query = 'SELECT ID, Username, Password FROM user WHERE Username=' + connection.escape(username) +
                ' AND Password=' + connection.escape(password) + ';';

    connection.query(query, function(err, result) {
        console.log(result);

        if (err) {
            console.log(err);
            callback(true);
            return;
        }

        callback(false, result);
    });
};

exports.CreateUser = function(username, password, callback) {

    var query = 'INSERT INTO user (Username, Password) VALUES (' + connection.escape(username) +
        ', ' + connection.escape(password) + ');';

    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);

            if (err.code === 'ER_DUP_ENTRY')
                callback('Username already exists.');
            else
                callback('Error: Could not create user.');

            return;
        }

        console.log(result);
        callback('Created user "' + username + '"');
    });
};

exports.GetWorkouts = function(userid, callback) {

    var query = 'SELECT ID, Date, TimeOfDay, Location FROM workout WHERE UserID=' +
        connection.escape(userid) + ';';

    connection.query(query, function(err, result) {
        console.log('GetWorkouts err:');
        console.log(err);
        console.log('GetWorkouts result:');
        console.log(result);
        callback(result);
    });
};

exports.GetExercises = function(callback) {

    var query = 'SELECT ID, Name, Type FROM exercise;';

    connection.query(query, function(err, result) {
        console.log('GetExercises err:');
        console.log(err);
        console.log('GetExercises result:');
        console.log(result);
        callback(result);
    });
};