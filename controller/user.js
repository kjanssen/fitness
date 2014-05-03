var express    = require('express');
var dateformat = require('dateformat');
var db         = require('../models/db');
var router     = express.Router();

router.use(express.static(__dirname + '/../public'));

router.post('/check', function(req, res) {
    console.log(req.body);
    db.GetUserByPassword(req.body.username, req.body.password,
        function(err, users) {
            if (err) throw err;
            if (users.length > 0)
                res.send('Username and Password correct for user ' + users[0].Username);
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
    db.CreateUser(req.body.username, req.body.password, function(result) {
            console.log('CreateUser result: ');
            console.log(result);
            if(result.id !== null) {
                db.ToggleFollowing('1', result.id, function(following) {
                    res.send(result.message);
                });
            } else {
                res.send(result.message);
            }
        }
    );
});

router.post('/home', function(req, res) {
    console.log(req.body);

    var createUserHome = function(err, users) {
        if (err) throw err;
        if (users.length > 0)
            db.GetWorkouts(users[0].ID, function(workouts) {
                for (var i = 0; i < workouts.length; i++)
                    workouts[i].Date = dateformat(workouts[i].Date, 'm/d/yy');

                db.GetExercisesByUser(users[0].ID, function(exercises) {
                    db.GetFollowers(users[0].ID, function(followers) {
                        db.GetFollowing(users[0].ID, function(following) {

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

                            res.render('userhome', {user: users[0],
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
    };

    if ('userid' in req.body) {
        db.GetUserByID(req.body.userid, createUserHome);
    } else {
        db.GetUserByPassword(req.body.username, req.body.password, createUserHome);
    }
});

router.post('/editinfo', function(req, res) {
    console.log(req.body);

    db.GetUserByID(req.body.userid, function(err, users) {
        if (err) throw err;
        if (users.length > 0) {
            res.render('edituserinfo', {user: users[0]});
        }
    });
});

router.post('/updateinfo', function(req, res) {
    console.log('/user/updateinfo req.body:');
    console.log(req.body);

    var userInfo = {
        userid: req.body.userid,
        privacy: req.body.privacy,
        age: req.body.age,
        gender: req.body.gender,
        height: req.body.height,
        weight: req.body.weight
    };

    db.UpdateInfo(userInfo, function(success) {
        if (success)
            res.send({message: 'Information has been updated.'});
        else
            res.send({message: 'Error occurred while updating information.'});
    });

});

router.post('/changepassword', function(req, res) {
    console.log(req.body);

    db.GetUserByPassword(req.body.username, req.body.oldpassword, function(err, users) {
        if (err) throw err;
        if (users.length > 0) {
            db.ChangePassword(users[0].ID, req.body.newpassword, function(success) {
                if (success)
                    res.send('Password changed.');
                else
                    res.send('Error occurred while changing password.');
            });
        } else {
            res.send('Old password not correct');
        }
    });
});

router.post('/view', function(req, res) {
    console.log(req.body);

    var createUserHome = function(err, users) {
        if (err) throw err;
        if (users.length > 0)
            db.GetWorkouts(users[0].ID, function(workouts) {
                for (var i = 0; i < workouts.length; i++)
                    workouts[i].Date = dateformat(workouts[i].Date, 'm/d/yy');

                db.GetExercisesByUser(users[0].ID, function(exercises) {
                    db.GetFollowers(users[0].ID, function(followers) {
                        db.GetFollowing(users[0].ID, function(following) {

                            console.log('Freinds and followers: ');
                            console.log(followers);
                            console.log(following);

                            var friends = new Array();
                            var followinguser = false;

                            for (var i = 0; i < followers.length; i++) {
                                followinguser = followers[i].ID === parseInt(req.body.homeuserid) ? true : followinguser;
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
                            console.log(followinguser);

                            res.render('viewuser', {
                                    user: users[0],
                                    homeuser: {ID: req.body.homeuserid, Username: req.body.homeusername},
                                    workouts: workouts,
                                    exercises: exercises,
                                    followers: followers,
                                    following: following,
                                    friends: friends,
                                    followinguser: followinguser
                                }
                            );
                        });
                    });
                });
            });
        else
            res.render('index', {message: 'Username or Password not correct'});
    };

    db.GetUserByID(req.body.userid, createUserHome);
});

router.post('/togglefollowing', function(req, res) {
    console.log(req.body);

    db.ToggleFollowing(req.body.userid, req.body.followerid, function(following) {
        res.send({following: following});
    });
});

module.exports = router;