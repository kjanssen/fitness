var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'node',
    password: 'node_pass',
    database: 'fitness'
});

exports.GetUserByPassword = function(username, password, callback) {

    var query = 'SELECT ID, Username, Age, Height, Weight, Gender, Privacy ' +
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

exports.GetUserByID = function(userid, callback) {

    var query = 'SELECT ID, Username, Age, Height, Weight, Gender, Privacy ' +
        'FROM user ' +
        'WHERE ID=' + connection.escape(userid) + ';';

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

    var query = 'INSERT INTO user (Username, Password, Privacy) ' +
                    'VALUES (' + connection.escape(username) + ', ' + connection.escape(password) + ', \'PUBLIC\');';

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

exports.ChangePassword = function(userid, password, callback) {

    var query = 'UPDATE user ' +
                    'SET Password=' + connection.escape(password) + ' ' +
                    'WHERE ID=' + connection.escape(userid) + ';';

    connection.query(query, function (err, result) {
        console.log('ChangePassword err:');
        console.log(err);
        console.log('ChangePassword result:');
        console.log(result);

        if (err) callback(false)
        else callback(true);
    });
};

exports.UpdateInfo = function(userInfo, callback) {

    var query = 'UPDATE user SET ' +
                    'Age=' + userInfo.age + ', ' +
                    'Gender=' + (userInfo.gender === 'null' ? 'null' : connection.escape(userInfo.gender)) + ', ' +
                    'Height=' + userInfo.height + ', ' +
                    'Weight=' + userInfo.weight + ', ' +
                    'Privacy=' + connection.escape(userInfo.privacy) + ' ' +
                    'WHERE ID=' + userInfo.userid + ';';

    connection.query(query, function(err, result) {
        console.log('UpdateInfo err:');
        console.log(err);
        console.log('UpdateInfo result:');
        console.log(result);

        if (err) callback(false)
        else callback(true);
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

exports.ToggleFollowing = function(userid, followerid, callback) {

    var query = 'SELECT * FROM follower ' +
                    'WHERE UserID=' + connection.escape(parseInt(userid)) + ' ' +
                    'AND FollowerID=' + connection.escape(parseInt(followerid)) + ';';

    console.log(query);

    connection.query(query, function(err, result) {
        console.log('ToggleFollowing err:');
        console.log(err);
        console.log('ToggleFollowing result:');
        console.log(result);

        if (result.length > 0) {
            var unfollowQuery = 'DELETE FROM follower ' +
                                    'WHERE UserID=' + connection.escape(userid) + ' ' +
                                    'AND FollowerID=' + connection.escape(followerid) + ';';

            connection.query(unfollowQuery, function(err, result2) {
                callback(false);
            });
        } else {
            var followQuery = 'INSERT INTO follower ' +
                                  'VALUES (' + connection.escape(userid) + ', ' + connection.escape(followerid) + ');';

            connection.query(followQuery, function(err, result2) {
                callback(true);
            });
        }
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
                    'VALUES (' +
                    connection.escape(workout.date) + ', ' +
                    connection.escape(workout.userid) + ', ' +
                    connection.escape(workout.location) + ', ' +
                    connection.escape(workout.timeOfDay) + ');';

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
                    'VALUES (' +
                    connection.escape(workoutid) + ', ' +
                    connection.escape(exercise.exerciseid) + ', ' +
                    (exercise.weight === '0' ? 'null' : connection.escape(exercise.weight)) + ', ' +
                    (exercise.sets === '0' ? 'null' : connection.escape(exercise.sets)) + ', ' +
                    (exercise.reps === '0' ? 'null' : connection.escape(exercise.reps)) + ', ' +
                    (exercise.duration === '00:00:00' ? 'null' : connection.escape(exercise.duration)) + ', ' +
                    connection.escape(exercise.completed) + ', ' +
                    (exercise.comments === '' ? 'null' : connection.escape(exercise.comments)) + ');';

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