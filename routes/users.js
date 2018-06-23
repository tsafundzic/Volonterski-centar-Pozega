var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var passportVolunteer
var LocalStrategy = require('passport-local').Strategy;

var User = require('../model/user');
var Volunteer = require('../model/volunteer');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

//reister volunteer
router.get('/register_volunteer', function (req, res) {
	res.render('register_volunteer');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Login volunteer
router.get('/login_volunteer', function (req, res) {
	res.render('login_volunteer');
});

// Register User
// ---------->>>> ovdje promijeniti na Organisation
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var oib = req.body.oib;
	var address = req.body.address;
	var city = req.body.city;
	var phone = req.body.phone;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('oib', 'Oib is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('city', 'City is required').notEmpty();
	req.checkBody('phone', 'Phone is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and oib are already taken
		User.findOne({
			oib: {
				"$regex": "^" + oib + "\\b", "$options": "i"
			}
		}, function (err, user) {
			User.findOne({
				email: {
					"$regex": "^" + email + "\\b", "$options": "i"
				}
			}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						oib: oib,
						password: password,
						email: email,
						name: name,
						address: address,
						city: city,
						phone: phone
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
					req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});

//register volunteer
router.post('/register_volunteer', function (req, res) {

	console.log('Zahtjev ispucan');

	var name = req.body.name;
	var email = req.body.email;
	var address = req.body.address;
	var city = req.body.city;
	var dateOfBirth = req.body.datumrodenja;
	var phone = req.body.phone;
	var password = req.body.password;
	var password2 = req.body.password2;
	var english_level = req.body.poznavanjeengleskog;
	var computer_skill = req.body.poznavanjeradanaracunalu;
	var volunteering_availability = req.body.vrijemezavolontiranje;
	var volunteering_time = req.body.satitjedno;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('datumrodenja', 'Date of Birth is required').notEmpty();
	req.checkBody('address', 'Address is required').notEmpty();
	req.checkBody('city', 'City is required').notEmpty();
	req.checkBody('phone', 'Phone is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	console.log('Checkbody dobar');



	var errors = req.validationErrors();

	if (errors) {
		console.log(errors),
			res.render('register_volunteer', {
				errors: errors,

			});
	}
	else {

		//check if e-mail is taken
		console.log('Stvaranje novog volontera');

		var newVolunteer = new Volunteer({
			password: password,
			email: email,
			name: name,
			address: address,
			city: city,
			phone: phone,
			english_level: english_level,
			computer_skill: computer_skill,
			volunteering_availability: volunteering_availability,
			volunteering_time: volunteering_time,
			dateOfBirth: dateOfBirth
		});
		Volunteer.createVolunteer(newVolunteer, function (err, volunteer) {
			if (err) {
				console.log(err);
				throw err;
			}
			console.log(volunteer);
		});

		req.flash('success_msg', 'You are registered and can now login');
		console.log('You are registered and can now login')
		res.redirect('/users/login_volunteer');
	}
});




passport.use('organisation_strategy', new LocalStrategy(
	function (email, password, done) {
		User.getUserByUsername(email, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));


passport.use('volunteer_strategy', new LocalStrategy(
	function (email, password, done) {
		Volunteer.getVolunteerByEmail(email, function (err, volunteer) {
			if (err) throw err;
			if (!volunteer) {
				return done(null, false, { message: 'Unknown volunteer' });
			}

			Volunteer.comparePassword(password, volunteer.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, volunteer);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function(err, user){
		if(err) done(err);
		  if(user){
			done(null, user);
		  } else {
			 Volunteer.getVolunteerById(id, function(err, user){
			 if(err) done(err);
			 done(null, user);
		  })
	  }
	});
});

router.post('/login',
	passport.authenticate('organisation_strategy', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

	router.post('/login_volunteer',
	passport.authenticate('volunteer_strategy', { successRedirect: '/', failureRedirect: '/users/login_volunteer', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;