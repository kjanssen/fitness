var express = require('express');
var router = express.Router()

router.get('/', function(req, res) {
    // res.sendfile(__dirname + '/index.html');
    res.render('index', {message: null});
});

module.exports = router;