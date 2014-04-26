var express    = require('express');
var dateformat = require('dateformat');
var db         = require('../models/db');
var router     = express.Router();

router.use(express.static(__dirname + '/../public'));

router.post('/create', function(req, res) {
    console.log('exercise/create:');
    console.log(req.body);

    db.CreateExercise(req.body.name, req.body.type, function(err, result) {
        res.send({err: err, message: result.message, id: result.id});
    });
});

router.post('/view', function(req, res) {
    console.log('exercise/view');
    console.log(req.body);

    db.GetExerciseHistory(req.body.userid, req.body.exerciseid, function(history) {
        for (var i = 0; i < history.length; i++)
            history[i].Date = dateformat(history[i].Date, 'm/d/yy');

        db.GetExerciseById(req.body.exerciseid, function(exercise) {
            res.render('viewexercise', {user: {userid: req.body.userid, username: req.body.username},
                                        history: history,
                                        exercise: exercise[0]});
        });
    });
});

module.exports = router;