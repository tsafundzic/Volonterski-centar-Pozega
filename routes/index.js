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
			res.render('volunteers', { users: users });
		}
	});
});

router.get('/organisations', function (req, res) {
	mongoose.model('User').find({}, function (err, users) {
		if (err) {
			return console.error(err);
		} else {
			res.render('organisations', { users: users });
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

module.exports = router;
