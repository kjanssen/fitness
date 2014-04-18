var express    = require('express');
var dateformat = require('dateformat');
var db         = require('../models/db');
var router     = express.Router();

router.use(express.static(__dirname + '/../public'));

router.post('/check', function(req, res) {
    console.log(req.body);
    db.CheckUser(req.body.username, req.body.password,
        function(err, result) {
            if (err) throw err;
            if (result.length > 0)
                res.send('Username and Password correct for user ' + result[0].Username);
            else
                res.send('Username or Password not correct');
        }
    );
});

router.get('/create', function(req, res) {
    res.render('createuser');
});

router.post('/create', function(req, res) {
    console.log(req.body);
    db.CreateUser(req.body.username, req.body.password,
        function(result) {
            res.send(result);
        }
    );
});

router.post('/home', function(req, res) {
    console.log(req.body);
    db.CheckUser(req.body.username, req.body.password,
        function(err, result) {
            if (err) throw err;
            if (result.length > 0)
                db.GetWorkouts(result[0].ID, function(workouts) {
                    for (var i = 0; i < workouts.length; i++)
                        workouts[i].Date = dateformat(workouts[i].Date, 'm/d/yy');

                    db.GetExercises(function(exercises) {
                        res.render('userhome', {user: result[0], workouts: workouts, exercises: exercises});
                    });
                });
            else
                res.render('index', {message: 'Username or Password not correct'});
        }
    );
});

module.exports = router;