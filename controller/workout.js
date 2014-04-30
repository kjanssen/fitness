var express    = require('express');
var db         = require('../models/db');
var router     = express.Router();

router.use(express.static(__dirname + '/../public'));

router.post('/new', function(req, res) {
    console.log('workout/new');
    console.log(req.body);

    db.GetExercises(function(exercises) {
        db.GetLocations(function(locations) {
            res.render('newworkout', {
                user: { userid: req.body.userid, username: req.body.username },
                exercises: exercises,
                locations: locations});
        });
    });
});

router.post('/create', function(req, res) {
    console.log('workout/create:');
    console.log(req.body);

    console.log(req.body.workout);

    db.CreateWorkout(req.body.workout, function(err, result) {
        if (err) {
            res.send({message: result.message + ' Exercises not saved.'});
            return;
        }

        var failed = 0;
        var message = '';
        for (var i = 0; i < req.body.exercises.length; i++) {
            db.AddExerciseDone(result.id, req.body.exercises[i], function(err2, result2) {
                if (err2) {
                    failed++;
                    message = result2;
                    return;
                }
            });
        }

        if (failed > 0)
            res.send({message: failed + ' exercises not saved. ' + message});
        else
            res.send({message: result.message});
    });
});

router.post('/view', function(req, res) {
    console.log('Workout/view');
    console.log(req.body);

    db.GetExercisesByWorkout(req.body.workoutid, function(exercises) {
        console.log(exercises);
        res.render('viewworkout', { user: {userid: req.body.userid, username: req.body.username},
                                    workout: {date: req.body.date, timeOfDay: req.body.timeOfDay, location: req.body.location},
                                    exercises: exercises});
    });
});

module.exports = router;