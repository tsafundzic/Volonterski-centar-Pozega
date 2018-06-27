var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var expressValidator = require('express-validator');

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res) {
	res.render('index', { title: 'Korisničke stranice' });
});

router.get('/volunteers', function (req, res) {
	mongoose.model('Volunteer').find({}, function (err, users) {
		if (err) {
			return console.error(err);
		} else {
			res.render('volunteers', { users: users , title: 'Baza volontera' });
		}
	});
});

router.get('/organisations', function (req, res) {
	mongoose.model('User').find({}, function (err, users) {
		if (err) {
			return console.error(err);
		} else {
			res.render('organisations', { users: users , title: 'Baza organizatora'});
		}
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


//
//
//ORGANISATION
//
//
// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    mongoose.model('User').findById(id, function (err, user) {
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error( err);
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        } else {
			console.log(id + ' was  found');
            req.id = id;
            next(); 
        } 
    });
});

router.route('/:id/edit')
	.get(function(req, res) {
	    mongoose.model('User').findById(req.id, function (err, user) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            console.log('GET Retrieving ID: ' + user._id);
	            res.format({
	                html: function(){
	                       res.render('edit', {
	                          title: 'Ažuriranje - ' + user.name,
	                          "user" : user
	                      });
	                 },
	                json: function(){
	                       res.json(user);
	                 }
	            });
	        }
	    });
	})
	.put(function(req, res) {
		var name = req.body.name;
		var email = req.body.email;
		var oib = req.body.oib;
		var address = req.body.address;
		var city = req.body.city;
		var phone = req.body.phone;

	    mongoose.model('User').findById(req.id, function (err, user) {
	        user.update({
                oib: oib,				
				email: email,
				name: name,
				address: address,
				city: city,
				phone: phone
	        }, function (err) {
	          if (err) {
				  res.send("There was a problem updating the information to the database: " + err);
              } else {
				  res.json(user);      
	           }
            })
	    });
	})



//
//
//VOLUNTEER
//
//
router.param('id', function(req, res, next, id) {
    mongoose.model('Volunteer').findById(id, function (err, user) {
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error( err);
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        } else {
			console.log(id + ' was  found');
            req.id = id;
            next(); 
        } 
    });
});

router.route('/:id/edit_volunteer')
	.get(function(req, res) {
	    mongoose.model('Volunteer').findById(req.id, function (err, user) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            console.log('GET Retrieving ID: ' + user._id);
	            res.format({
	                html: function(){
	                       res.render('edit_volunteer', {
	                          title: 'Ažuriranje - ' + user.name,
	                          "user" : user
	                      });
	                 },
	                json: function(){
	                       res.json(user);
	                 }
	            });
	        }
	    });
	})
	.put(function(req, res) {
		var name = req.body.name;
		var email = req.body.email;
		var address = req.body.address;
		var city = req.body.city;
		var dateOfBirth = req.body.datumrodenja;
		var phone = req.body.phone;
		var sex = req.body.spol;
		var english_level = req.body.poznavanjeengleskog;
		var computer_skill = req.body.poznavanjeradanaracunalu;
		var volunteering_availability = req.body.vrijemezavolontiranje;
		var volunteering_time = req.body.satitjedno;

	    mongoose.model('Volunteer').findById(req.id, function (err, user) {
	        user.update({
                email: email,
				name: name,
				address: address,
				city: city,
				phone: phone,
				sex: sex,
				english_level: english_level,
				computer_skill: computer_skill,
				volunteering_availability: volunteering_availability,
				volunteering_time: volunteering_time,
				dateOfBirth: dateOfBirth
	        }, function (err) {
	          if (err) {
				  res.send("There was a problem updating the information to the database: " + err);
              } else {
				  res.json(user);      
	           }
            })
	    });
	})


module.exports = router;
