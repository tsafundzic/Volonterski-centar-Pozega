var express = require('express');
var router = express.Router();

var expressValidator = require('express-validator');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index', { title: 'Korisničke stranice' });
});

router.get('/volunteers',  function(req, res){
	res.render('volunteers', { title: 'Baza volontera' });
});

router.get('/organisations',  function(req, res){
	res.render('organisations', { title: 'Baza organizatora' });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
