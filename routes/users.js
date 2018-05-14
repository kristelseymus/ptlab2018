(function() {

    'use strict';

    var express = require('express');
    var router = express.Router();
    var mongoose = require('mongoose');
    var passport = require('passport');
    var User = mongoose.model('User');
    var Content = mongoose.model('Content');
    var jwt = require('express-jwt');
    var jwttoken = require('jsonwebtoken');
    var auth = jwt({
        secret: 'SECRET',
        userProperty: 'payload'
    });

    var nodemailer = require('nodemailer');
    var path = require('path');
    var ejs = require('ejs');
    var moment = require('moment');
    var async = require('async');
    var crypto = require('crypto');
    var transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'akmyw3k5peyqymel@ethereal.email',
        pass: '3BWDbFYkQNjYfVy1WT'
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000
    });

    //REGION AUTHENTICATION ROUTING

    /* POST register */
    router.post('/register', function(req, res, next) {
      console.log(req.body);
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
        user.telefoonnummer = req.body.telefoonnummer;
        user.bedrijfsnaam = req.body.bedrijfsnaam;
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
    /* POST forgot password mail */
    router.post('/forgot', function(req, res, next){
      async.waterfall([
        function(done){
          crypto.randomBytes(20, function(err, buf){
            var token = buf.toString('hex');
            done(err, token);
          })
        },
        function(token, done){
          User.findOne({'username': req.body.username}, function(err, user){
            if(!user){
              return res.status(500).send({
                  success: false,
                  message: 'Er bestaat geen gebruiker met dit e-mailadres.'
              });
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; //1 uur

            user.save(function(err){
              done(err, token, user);
            });
          });
        },
        function(token, user, done){
          var link = "http://" + req.headers.host + "/reset/" + token;
          Content.findOne({}, 'adres', function(err, value){
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/forgotpasswordemail.ejs'), { voornaam: user.voornaam, naam: user.naam, email: user.username, adres: value.adres, link: link, moment: moment}, function(err, data){
              if(err){
                console.log(err);
              } else {
                var mailOptions = {
                  from: "Planet Talent <contact@planet-talent.com>",
                  to: user.username,
                  subject: "Wachtwoord vergeten",
                  text: "text",
                  html: data,
                  attachments: [{
                    filename: 'logo.jpg',
                    path: path.resolve(__dirname, '../public/images/Logo_PTLab-01.jpg'),
                    cid: 'logoimage'
                  }]
                };

                transporter.sendMail(mailOptions, function(error, response){
                  if(error){
                    console.log(error);
                    res.end("error");
                  } else {
                    console.log("Message sent: " + response.message);
                    res.json({message: "Er is een e-mail verzonden naar " + user.username + " met verdere instructies."});
                    done(err, 'done');
                  }
                });
              }
            });
          });
        }
      ], function(err){
        if(err){
          return next(err);
        }
        res.redirect('/forgot');
      });
    });
    router.post('/reset/:token', function(req, res, next){
      async.waterfall([
        function(done){
          User.findOne({ 'resetPasswordToken' : req.params.token, 'resetPasswordExpires' : { '$gt' : Date.now() } }, function(err, user){
            if(!user){
              return res.json({message: 'De reset token is niet geldig of is verlopen.'});
              //return res.redirect('back');
            }
            if (req.body.password != req.body.passwordcheck) {
              return res.status(500).send({
                  success: false,
                  message: "Passwords don't match"
              });
            }
            user.setPassword(req.body.password);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err){
              if(err){
                res.send(err);
              }
              passport.authenticate('local', function(err, user, info) {
                  if (err) {
                      return next(err);
                  }
                  if (user) {
                      res.json({
                          token: user.generateJWT(),
                          userid : user._id
                      });
                      done(err, user);
                  } else {
                      return res.status(401).json(info);
                  }
              })(req, res, next);
            })
          });
        },
        function(user, done){
          Content.findOne({}, 'adres', function(err, value){
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/forgotpasswordsuccessemail.ejs'), { voornaam: user.voornaam, naam: user.naam, email: user.username, adres: value.adres, moment: moment}, function(err, data){
              if(err){
                console.log(err);
              } else {
                var mailOptions = {
                  from: "Planet Talent <contact@planet-talent.com>",
                  to: user.username,
                  subject: "Wachtwoord gewijzigd",
                  text: "text",
                  html: data,
                  attachments: [{
                    filename: 'logo.jpg',
                    path: path.resolve(__dirname, '../public/images/Logo_PTLab-01.jpg'),
                    cid: 'logoimage'
                  }]
                };

                transporter.sendMail(mailOptions, function(error, response){
                  if(error){
                    console.log(error);
                    res.end("error");
                  } else {
                    console.log("Message sent: " + response.message);
                    done(err, 'done');
                  }
                });
              }
            });
          });
        }
      ], function(err){
        res.redirect('/');
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
