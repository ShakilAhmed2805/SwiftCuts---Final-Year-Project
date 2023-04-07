var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const path = require('path');
// countries-list
const countries = require('countries-list');
const countriesList = countries.countries;
var moment = require('moment');



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin/index', {title: 'Admin Dashboard'});
});

// Add Salon Page
router.get('/add-salon', function(req, res, next) {
    //console.log(countriesList);
    const countryCodes = Object.keys(countries.countries);
    const countryNames = countryCodes.map(code => countries.countries[code].name);
    console.log(countryCodes);
    countryNames.sort();

    res.render('admin/addSalon', {
        countries: countryNames,
        title: "Add Salon",
        errors: req.flash('errors'),
        success: req.flash('success'),
    });
});

//Process post request for add salon

router.post('/add-salon',[
    body('salon_name').not().isEmpty().withMessage('Name is required'),
    body('addresse').not().isEmpty().withMessage('Address is required'),
    body('city').not().isEmpty().withMessage('City is required'),
    body('state').not().isEmpty().withMessage('State is required'),
    body('postcode').not().isEmpty().withMessage('Zip is required'),
    body('country').not().isEmpty().withMessage('Country is required'),
    ]  ,  function(req, res, next) {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        res.redirect('/admin/add-salon');
    }else {

        const name = req.sanitize(req.body.salon_name);
        const address = req.sanitize(req.body.addresse);
        const city = req.sanitize(req.body.city);
        const state = req.sanitize(req.body.state);
        const zip = req.sanitize(req.body.postcode).trim();
        const country = req.sanitize(req.body.country);

        console.log(req.body);
        if(!req.files) {

            console.log("No files were uploaded.");

        }else
        {
            console.log(req.files.image)

            const file = req.files.image;
            //generate image name as name + timestamp
            const filename = name + '-' + Date.now() + path.extname(file.name);
            console.log(filename)
            const filepath = path.join(__dirname, '../public/images/salons/', filename);
            file.mv(filepath, function(err) {
                if(err) throw err;
                let sql = "INSERT INTO salons (name, address, city, state, postcode, country, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
                db.query(sql, [name, address, city, state, zip, country, filename], (err, result) => {
                    if (err) throw err;
                    req.flash('success', "Salon added successfully");
                    res.redirect('/admin/salons');
                });
            });
        }

    }



});

//Single salon
router.get('/salon/:id', function(req, res, next) {

    const id = req.params.id;
    let sql = "SELECT * FROM salons WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if(result.length == 0) {
            req.flash('errors', [{msg: 'Given salon does not exist'}]);
            res.redirect('/admin/salons');
        }
        console.log(result.length);
        console.log(result);
        res.render('admin/single-salon', {title: result[0].name, salon: result[0], moment: moment});
    });
});

//Single salon
router.get('/salon/edit/:id', function(req, res, next) {

    //console.log(countriesList);
    const countryCodes = Object.keys(countries.countries);
    const countryNames = countryCodes.map(code => countries.countries[code].name);
    console.log(countryCodes);
    countryNames.sort();

    const id = req.params.id;
    let sql = "SELECT * FROM salons WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        if(result.length == 0) {
            req.flash('errors', [{msg: 'Given salon does not exist'}]);
            res.redirect('/admin/salons');
        }
        console.log(result.length);
        console.log(result);
        res.render('admin/edit-salon', {
            countries: countryNames,
            title: 'Edit Salon',
            salon: result[0],
            moment: moment,
            errors: req.flash('errors'),
            success: req.flash('success'),
        });
    });
});

// Process edit salon post request
router.post('/salon/edit/:id',[
    body('salon_name').not().isEmpty().withMessage('Name is required'),
    body('addresse').not().isEmpty().withMessage('Address is required'),
    body('city').not().isEmpty().withMessage('City is required'),
    body('state').not().isEmpty().withMessage('State is required'),
    body('postcode').not().isEmpty().withMessage('Zip is required'),
    body('country').not().isEmpty().withMessage('Country is required'),
], function (req, res){


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        res.redirect('/admin/add-salon');
    }else {

        const id = req.params.id;
        const name = req.sanitize(req.body.salon_name);
        const address = req.sanitize(req.body.addresse);
        const city = req.sanitize(req.body.city);
        const state = req.sanitize(req.body.state);
        const zip = req.sanitize(req.body.postcode).trim();
        const country = req.sanitize(req.body.country);

        console.log(req.body);
        if(!req.files) {

            //update query
            let sql = "update salons set name = ?, address = ?, city = ?, state = ?, postcode = ?, country = ? WHERE id = ?";
            db.query(sql, [name, address, city, state, zip, country, id], (err, result) => {
                if (err) throw err;
                req.flash('success', "Salon updated successfully");
                res.redirect('/admin/salons');
            });


        }else
        {
            console.log(req.files.image)

            const file = req.files.image;
            //generate image name as name + timestamp
            const filename = name + '-' + Date.now() + path.extname(file.name);
            console.log(filename)
            const filepath = path.join(__dirname, '../public/images/salons/', filename);
            file.mv(filepath, function(err) {
                if(err) throw err;
                let sql = "INSERT INTO salons (name, address, city, state, postcode, country, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
                db.query(sql, [name, address, city, state, zip, country, filename], (err, result) => {
                    if (err) throw err;
                    req.flash('success', "Salon updated successfully");
                    res.redirect('/admin/salons');
                });
            });
        }
    }
})
//Display all salons
router.get('/salons', function(req, res, next) {
    let sql = "SELECT * FROM salons";
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('admin/salons', {
            title: "Salons",
            salons: result,
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    });
});


//Delete salon
router.get('/salon/delete/:id', function(req, res, next) {

        const id = req.params.id;
        let sql = "DELETE FROM salons WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) throw err;
            req.flash('success', "Salon deleted successfully");
            res.redirect('/admin/salons');
        });

});


// Get services
router.get('/services', function(req, res, next) {

    res.render('admin/services', {title : 'Services', errors: req.flash('errors'), success: req.flash('success')});

});

//Add Service
router.get('/add-service', function(req, res, next) {



});
module.exports = router;