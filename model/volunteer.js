var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Volunteer Schema
var VolunteerSchema = mongoose.Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    dateOfBirth:{
        type: Date,
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    phone: {
        type: Number
    },
    english_level: {
        type: String,
    },
    computer_skill: {
        type: String,
    },
    volunteering_availability: {
        type: String
    },
    volunteering_time: {
        type: String
    }
});

var Volunteer = module.exports = mongoose.model('Volunteer', VolunteerSchema);

module.exports.createVolunteer = function (newVolunteer, callback) {
    console.log('In the create Volunteer function');
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newVolunteer.password, salt, function (err, hash) {
            newVolunteer.password = hash;
            newVolunteer.save(callback);
        });
    });
}

module.exports.getVolunteerByEmail = function (email, callback) {
    var query = { email: email };
    Volunteer.findOne(query, callback);
}

module.exports.getVolunteerById = function (id, callback) {
    Volunteer.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}