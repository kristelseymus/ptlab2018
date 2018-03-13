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
    reservaties : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservatie'
    }],
    events : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

/*
  const payload = {
    id: user._id,
    isAdmin: user.isAdmin,
    username: user.username,
    fullName: user.fullName,
    voornaam: user.voornaam,
    naam: user.naam
  };
  const tok = jwttoken.sign(payload, "superSecret", {
    expiresIn: 86400,
  });
  return res.json({
      token: tok,
      userid : user._id
  });*/

  return jwt.sign({
    _id : this._id,
    username: this.username,
    isAdmin: this.isAdmin,
    fullName: this.fullName,
    voornaam: this.voornaam,
    naam: this.naam ,
    exp: parseInt(exp.getTime() / 1000)
    }, 'SECRET');
};


mongoose.model('User', UserSchema);

//    challenges: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Challenge'
//    }],
