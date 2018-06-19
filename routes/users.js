var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../model/user');

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

// Register User
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
		User.findOne({ oib: { 
			"$regex": "^" + oib + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
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
		User.findOne({ oib: { 
			"$regex": "^" + oib + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
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


passport.use(new LocalStrategy(
	function (oib, password, done) {
		User.getUserByUsername(oib, function (err, user) {
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

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;