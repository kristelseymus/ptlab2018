var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true
    },
    voornaam: String,
    naam: String,
    dateOfCreation : {type: Date, default: Date.now},
    isAdmin: {type: Boolean, default: false},
    typeUser: {
        type: String,
        enum : ['STUDENT','COWORKER', 'MANAGER'],
        default: 'MANAGER'
    },
    hash: String,
    salt: String,
    fullName : String,
    telefoonnummer: String,
    bedrijfsnaam: String,
    reservaties : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservatie'
    }],
    events : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

//Method to set the password of a user
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, null).toString('hex');
};

//Method to validate the password of a user
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, null).toString('hex');

    return this.hash === hash;
};

//Method to generate a JWT token for authentication
UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id : this._id,
    username: this.username,
    isAdmin: this.isAdmin,
    fullName: this.fullName,
    voornaam: this.voornaam,
    naam: this.naam,
    typeuser: this.typeUser,
    exp: parseInt(exp.getTime() / 1000)
    }, 'SECRET');
};


mongoose.model('User', UserSchema);
