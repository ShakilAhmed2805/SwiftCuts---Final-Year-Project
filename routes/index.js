var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {

    let sql = "SELECT * FROM salons";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        let data = Object.assign({}, { title: "SwiftCuts"}, {salons: result});
        res.render('index', data);
    });
});


//About Page
router.get('/about', function(req, res, next) {
      res.render('about', { title: 'About Us' });
});



//Contact Page
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Contact' });
});


//Sign up Page
router.get('/signup', function(req, res, next) {
    const errors = req.flash('errors');
    const success = req.flash('success');

    console.log(errors);
    let data = Object.assign({}, { title: "Signup"}, {errors: errors}, {success: success });
    res.render('signup', data);
});

//Sign up post Page
router.post('/signup', [
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.'),
    body('email').isEmail().withMessage('Invalid Email Address.'),
    body('password').isStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.'),
], function(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        res.redirect('/signup');
    }else {

        let first_name = req.sanitize(req.body.first_name);
        let last_name = req.sanitize(req.body.last_name);
        let email = req.sanitize(req.body.email);
        let password = req.sanitize(req.body.password);

        bcrypt.hash(password, saltRounds, function(err, hash) {

            if (err) throw err;
            //Check email exist or not in database
            //If exist then send error message
            let sql = "SELECT * FROM users WHERE email = ?";
            db.query(sql, [email], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.send('Email already exist');
                }else {
                    //Insert data into database
                    let sql = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
                    db.query(sql, [first_name, last_name, email, hash], (err, result) => {
                        if (err) throw err;
                        console.log(result);

                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/login');

                    });
                }
            });

            // Store hash in your password DB.

        });
    }


});


//Login Page
router.get('/login', function(req, res, next) {

    const errors = req.flash('errors');
    const success = req.flash('success');

    console.log(errors);
    let data = Object.assign({}, { title: "Login"}, {errors: errors}, {success: success });
    res.render('login', data);
});

//Login post Page
router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email Address.'),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        res.redirect('/login');
    }else {
        let email = req.sanitize(req.body.email);
        let password = req.sanitize(req.body.password);

        let sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, function(err, response) {
                    if (err) throw err;
                    if (response) {
                        req.session.user = result[0];
                        res.redirect('/');
                    }else {
                        req.flash('errors', {msg: "Invalid email or password"});
                        res.redirect('/login');
                    }
                });
            }else {
                req.flash('errors', {msg: "Invalid email or password"});
                res.redirect('/login');
            }
        });
    }

});


//Post request for subscribe newsletter
router.post('/subscribe', function(req, res, next) {
    res.send(req.body);
});



//Make Appointment Page
router.get('/book-now', function(req, res, next) {

    let query = "select id from appointments where cast(appointment_date as Date) = cast(now() as Date)";
    db.query(query, (err, result) => {
        if (err) throw err;
        //get all salons
        console.log(result.length);
        let sql = "SELECT * FROM salons";
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);

            let data = Object.assign({}, { title: "Make Appointment"}, {salons: result});
            res.render('booknow', data);
        });
    });


});

//Post request for make appointment
router.post('/book-now', function(req, res, next) {
    res.send(req.body);
});

//Show all salons
router.get('/salons', function(req, res, next) {
    let sql = "SELECT * FROM salons";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        let data = Object.assign({}, { title: "Salons"}, {salons: result});
        res.render('salons', data);
    });
});





// This is all testings routes


// Get all users from database
router.get('/users', function(req, res, next) {

        let sql = "SELECT * FROM users";
        db.query(sql, (err, result) => {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                console.log(result[i].first_name);

            }
            res.send(result);
        });

});

//Delete all users from database
router.get('/delete', function(req, res, next) {
        let sql = "DELETE FROM users";
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.send('All users deleted');
        });
});


module.exports = router;
