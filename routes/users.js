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

    //REGION AUTHENTICATION ROUTING

    /* POST register */
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
        user.typeUser = req.body.typeUser;
        user.fullName = req.body.voornaam + " " + req.body.naam;
        if(req.body.isAdmin == true) {
          user.isAdmin = req.body.isAdmin;
        } else  {
          user.isAdmin = false;
        }
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
    /* POST login */
    router.post('/login', function(req, res, next) {
      console.log("inside login api");
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
                    userid : user._id
                });
            } else {
                return res.status(401).json(info);
            }
        })(req, res, next);
    });

    //END REGION AUTHENTICATION ROUTING

    //REGION USERS ROUTING

    /* GET users */
    router.get('/', function(req, res, next) {
        User.find(function(err, users) {
            if (err) {
                return next(err);
            }
            res.json(users);
        });
    });
    /* GET nonadmins */
    router.get('/nonadmins', function(req, res, next) {
        User.find({'isAdmin': 'false'},function(err, users) {
            if (err) {
                return next(err);
            }
            res.json(users);
        });
    });
    /* GET user by id */
    router.get('/:user', function(req, res, next) {
        res.json(req.user);
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
    /* PUT changepassword */
    router.put('/changepassword', auth, function(req, res, next) {
      console.log("inside changepassword api");
        User.findById(req.payload._id, function(err, user) {
            if (err) {
                res.send(err);
            }
            if (req.body.password != req.body.passwordcheck) {
              return res.status(500).send({
                  success: false,
                  message: "Passwords don't match"
              });
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
    /* PUT update user */
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
    /* DELETE user */
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

    //END REGION USERS ROUTING

    module.exports = router;

})();
