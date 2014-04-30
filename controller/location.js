var express    = require('express');
var db         = require('../models/db');
var router     = express.Router();

router.use(express.static(__dirname + '/../public'));

router.post('/create', function(req, res) {
    console.log('location/create:');
    console.log(req.body);

    db.CreateLocation(req.body.name, function(err, result) {
        res.send({err: err, message: result.message, id: result.id});
    });
});

module.exports = router;