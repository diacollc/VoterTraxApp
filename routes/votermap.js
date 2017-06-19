var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    
    res.render('votermap', { title: 'Voter Trax Online' });
});

module.exports = router;