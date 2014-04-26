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

                    db.GetExercisesByUser(result[0].ID, function(exercises) {
                        db.GetFollowers(result[0].ID, function(followers) {
                            db.GetFollowing(result[0].ID, function(following) {

                                console.log('Freinds and followers: ');
                                console.log(followers);
                                console.log(following);

                                var friends = new Array();

                                for (var i = 0; i < followers.length; i++) {
                                    for (var j =0; j < following.length; j++) {
                                        if (followers[i].ID === following[j].ID) {
                                            friends.push(followers.splice(i, 1)[0]);
                                            following.splice(j, 1);
                                            i--;
                                            break;
                                        }
                                    }
                                }

                                console.log(followers);
                                console.log(following);
                                console.log(friends);

                                res.render('userhome', {user: result[0],
                                                        workouts: workouts,
                                                        exercises: exercises,
                                                        followers: followers,
                                                        following: following,
                                                        friends: friends
                                    }
                                );
                            });
                        });
                    });
                });
            else
                res.render('index', {message: 'Username or Password not correct'});
        }
    );
});

module.exports = router;