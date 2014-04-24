var express    = require('express');
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

module.exports = router;