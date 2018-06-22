var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Organisation Schema
var OrganisationSchema = mongoose.Schema({
	oib: {
		type: Number,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	address: {
		type: String
	},
	city: {
		type: String
	},
	phone: {
		type: Number
	}
});

var Organisation = module.exports = mongoose.model('Organisation', OrganisationSchema);

module.exports.createOrganisation = function(newOrganisation, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newOrganisation.password, salt, function(err, hash) {
	        newOrganisation.password = hash;
	        newOrganisation.save(callback);
	    });
	});
}

module.exports.getOrganisationByEmail = function(email, callback){
	var query = {email: email};
	Organisation.findOne(query, callback);
}

module.exports.getOrganisationById = function(id, callback){
	Organisation.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}