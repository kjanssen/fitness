var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'node',
    password: 'node_pass',
    database: 'fitness'
});

exports.CheckUser = function(username, password, callback) {

    var query = 'SELECT ID, Username, Password ' +
                    'FROM user ' +
                    'WHERE Username=' + connection.escape(username) + ' ' +
                    'AND Password=' + connection.escape(password) + ';';

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

    var query = 'INSERT INTO user (Username, Password) ' +
                    'VALUES (' + connection.escape(username) + ', ' + connection.escape(password) + ');';

    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);

            if (err.code === 'ER_DUP_ENTRY') {
                callback('Username already exists.');
            } else {
                callback('Error: Could not create user.');
            }

            return;
        }

        console.log(result);
        callback('Created user "' + username + '"');
    });
};

exports.GetFollowers = function(userid, callback) {

    var query = 'SELECT u.ID, u.Username, u.Privacy ' +
                    'FROM user u ' +
                    'JOIN follower f ON u.ID=f.FollowerID ' +
                    'JOIN user s ON f.UserID=s.ID ' +
                    'WHERE f.UserID=' + connection.escape(userid) + ';';

    connection.query(query, function (err, result) {
        console.log('GetFollowers err:');
        console.log(err);
        console.log('GetFollowers result:');
        console.log(result);
        callback(result);
    });
};

exports.GetFollowing = function(userid, callback) {

    var query = 'SELECT s.ID, s.Username, s.Privacy ' +
                    'FROM user u ' +
                    'JOIN follower f ON u.ID=f.FollowerID ' +
                    'JOIN user s ON f.UserID=s.ID ' +
                    'WHERE f.FollowerID=' + connection.escape(userid) + ';';

    connection.query(query, function (err, result) {
        console.log('GetFollowing err:');
        console.log(err);
        console.log('GetFollowing result:');
        console.log(result);
        callback(result);
    });
};

exports.GetWorkouts = function (userid, callback) {

    var query = 'SELECT ID, Date, TimeOfDay, Location ' +
                    'FROM workout ' +
                    'WHERE UserID=' + connection.escape(userid) + ';';

    connection.query(query, function (err, result) {
        console.log('GetWorkouts err:');
        console.log(err);
        console.log('GetWorkouts result:');
        console.log(result);
        callback(result);
    });
};

exports.GetExercises = function (callback) {

    var query = 'SELECT ID, Name, Type ' +
                    'FROM exercise;';

    connection.query(query, function (err, result) {
        console.log('GetExercises err:');
        console.log(err);
        console.log('GetExercises result:');
        console.log(result);
        callback(result);
    });
};

exports.GetExerciseById = function (exerciseid, callback) {

    var query = 'SELECT ID, Type, Name FROM exercise WHERE ID=' + connection.escape(exerciseid) + ';';

    connection.query(query, function(err, result) {
        console.log('GetExerciseByID err:');
        console.log(err);
        console.log('GetExerciseByID result:');
        console.log(result);
        callback(result);
    });
};

exports.GetExercisesByWorkout = function (workoutid, callback) {

    var query = 'SELECT e.Type, e.Name, d.Weight, d.Sets, d.Reps, d.Duration, d.Completed, d.Comment ' +
                    'FROM workout w ' +
                    'JOIN exercise_done d ON w.ID=d.WorkoutID ' +
                    'JOIN exercise e ON d.ExerciseID=e.ID ' +
                    'WHERE w.ID=' + connection.escape(workoutid) + ';';

    connection.query(query, function (err, result) {
        console.log('GetExercisesByWorkout err:');
        console.log(err);
        console.log('GetExercisesByWorkout result:');
        console.log(result);
        callback(result);
    });
};

exports.GetExercisesByUser = function (userid, callback) {

    var query = 'SELECT e.ID, e.Name, e.Type ' +
                    'FROM workout w ' +
                    'JOIN exercise_done d ON w.ID=d.WorkoutID ' +
                    'JOIN exercise e ON d.ExerciseID=e.ID ' +
                    'WHERE w.UserID=' + connection.escape(userid) + ' ' +
                    'GROUP BY e.ID;';

    connection.query(query, function(err, result) {
        console.log('GetExercisesByUser err:');
        console.log(err);
        console.log('GetExercisesByUser result:');
        console.log(result);
        callback(result);
    });
};

exports.GetExerciseHistory = function(userid, exerciseid, callback) {

    var query = 'SELECT w.Date, d.Weight, d.Sets, d.Reps, d.Duration, d.Completed, d.Comment ' +
                    'FROM exercise_done d ' +
                    'JOIN workout w ON d.WorkoutID=w.ID ' +
                    'WHERE w.UserID=' + connection.escape(userid) + ' AND d.ExerciseID=' + connection.escape(exerciseid) + ' ' +
                    'ORDER BY w.Date DESC;';

    connection.query(query, function(err, result) {
        console.log('GetExerciseHistory err:');
        console.log(err);
        console.log('GetExerciseHistory result:');
        console.log(result);
        callback(result);
    });
};

exports.CreateWorkout = function(workout, callback) {

    var query = 'INSERT INTO workout (Date, UserID, Location, TimeOfDay) ' +
                    'VALUES (' + connection.escape(workout.date) + ', ' + connection.escape(workout.userid) + ', ' +
                    connection.escape(workout.location) + ', ' + connection.escape(workout.timeOfDay) + ');';

    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);

            if (err.code === 'ER_DUP_ENTRY')
                callback(true, { message: 'Workout at that time already exists.', id: null });
            else
                callback(true, { message: 'Error: Could not create workout.', id: null});

            return;
        }

        console.log(result);
        callback(false, { message: 'Workout has been created.', id: result.insertId});
    });
};

exports.AddExerciseDone = function(workoutid, exercise, callback) {

    var query = 'INSERT INTO exercise_done (WorkoutID, ExerciseID, Weight, Sets, Reps, Duration, Completed, Comment) ' +
                'VALUES (' + connection.escape(workoutid) + ', ' + connection.escape(exercise.exerciseid) + ', ' +
                connection.escape(exercise.weight) + ', ' + connection.escape(exercise.sets) + ', ' +
                connection.escape(exercise.reps) + ', ' + connection.escape(exercise.duration) + ', ' +
                connection.escape(exercise.completed) + ', ' + connection.escape(exercise.comments) + ');';

    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);

            if (err.code === 'ER_DUP_ENTRY')
                callback(true, 'Cannot save the same exercise twice per workout.');
            else
                callback(true, 'Error: Could not save exercise.');

            return;
        }

        console.log(result);
        callback(false, 'Exercise has been saved.');
    });
};

exports.CreateExercise = function(name, type, callback) {

    var query = 'INSERT INTO exercise (Name, Type) VALUES (' + connection.escape(name) + ', ' +
                connection.escape(type) + ');';

    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);

            if (err.code === 'ER_DUP_ENTRY')
                callback(true, {message: 'Exercise already exists.', id: null});
            else
                callback(true, {message: 'Error: Could not add exercise.', id: null});

            return;
        }

        console.log(result);
        callback(false, {message: 'Exercise has been added.', id: result.insertId});
    });
};