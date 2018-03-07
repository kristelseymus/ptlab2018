(function() {

    'use strict';

    var express = require('express');
    var router = express.Router();
    var mongoose = require('mongoose');
    var passport = require('passport');
    var User = mongoose.model('User');
    var jwt = require('express-jwt');
    var jwttoken = require('jsonwebtoken');
    var auth = jwt({
        secret: 'SECRET',
        userProperty: 'payload'
    });



    //region AUTHENTICATION ROUTING
    router.post('/register', function(req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'Vul alle velden in'
            });
        }
        var  options = {
          setDefaultsOnInsert: true
        };
        var user = new User();
        user.username = req.body.username;
        user.setPassword(req.body.password);
        user.voornaam = req.body.voornaam;
        user.naam = req.body.naam;
        user.fullName = req.body.voornaam + " " + req.body.naam;
        user.save(options, function(err) {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    //Duplicate username
                    return res.status(500).send({
                        success: false,
                        message: 'User already exists'
                    });
                }
                return res.status(500).send(err);
            }
            return res.json({
                token: user.generateJWT(),
                userid : user._id
            });
        });
    });

    router.post('/login', function(req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'Vul alle velden in'
            });
        }
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (user) {
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
                });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });
    router.post('/app/login', function(req, res, next) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'Vul alle velden in'
            });
        }
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (user) {
                return res.json({
                    token: user.generateJWT(),
                    userid : user._id,
                    isAdmin: user.isAdmin
                });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });
    //endregion

    //region USERS ROUTING
    router.put('/changepassword', auth, function(req, res) {
        User.findById(req.payload._id, function(err, user) {
            if (err) {
                res.send(err);
            }
            user.setPassword(req.body.password);
            user.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json(user);
            })
        });
    });

    router.get('/', function(req, res, next) {
        User.find(function(err, users) {
            if (err) {
                return next(err);
            }

            res.json(users);
            console.log(users);
        });
        console.log("hello");
    });
    router.get('/nonadmins', function(req, res, next) {
        User.find({'isAdmin': 'false'},function(err, users) {
            if (err) {
                return next(err);
            }

            res.json(users);
        });
    });
    router.get('/:user', function(req, res, next) {
        res.json(req.user);
        console.log("hello2");
    });

    router.put('/:user', function (req, res) {
        User.findById(req.user._id, function (err, user) {
            if (err) {
                res.send(err);
            }
            user.username = req.body.username;
            user.voornaam = req.body.voornaam;
            user.naam = req.body.naam;
            user.fullName = req.body.voornaam + " " + req.body.naam;

            user.save(function(err) {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        //Duplicate username
                        return res.status(500).send({
                            success: false,
                            message: 'Gebruiker bestaat al'
                        });
                    }
                    return res.status(500).send(err);
                }
                return res.json(user);
            });
        });
    });

    router.param('user', function(req, res, next, id) {
        var query = User.findById(id);

        query.exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error('can\'t find user'));
            }

            req.user = user;
            return next();
        });
    });

    router.delete('/:user', auth, function(req, res, next) {
        User.remove({
            _id: req.user._id
        }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'User deleted'
            });
        });
    });

    //endregion

    module.exports = router;

})();
