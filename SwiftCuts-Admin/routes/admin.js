var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   //Send Admin Page
    res.render('admin/dashboard', { title: 'Admin Dashboard' });
});

module.exports = router;
