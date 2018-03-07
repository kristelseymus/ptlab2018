(function () {

    'use strict';

    var mongoose = require('mongoose');
    var express = require('express');
    var ObjectId = require('mongoose').Types.ObjectId;

    var router = express.Router();
    var Reservatie = mongoose.model('Reservatie');
    var User = mongoose.model('User');
    var Ruimte = mongoose.model('Ruimte');
    var passport = require('passport');
    var jwt = require('express-jwt');
    var auth = jwt({
        secret: 'SECRET',
        userProperty: 'payload'
    });

    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });

    router.get('/home', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });

    router.get('/home#voorwie', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/home#ruimtes', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/home#prijzen', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/home#practicals', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/home#agenda', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/contact', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/login', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/register', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/settings', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/boekplaatsstudent', function(req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/vraagofferteaan', function(req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/gratisplaats', function(req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });
    router.get('/mijnreservaties', function(req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });

    //region Reservaties
    router.post('/api/reservaties', auth, function (req, res, next) {
        var reservatie = new Reservatie(req.body);
        console.log(reservatie);
        console.log(reservatie.user);
        reservatie.save(function (err, reservatie) {
            if (err) {
                return next(err);
            }
        });
        User.findOne({ '_id' : new ObjectId(reservatie.user) }).exec(function (err, user) {
            if (err) {
                res.send(err);
                console.log(err);
            }
            console.log("USER");
            console.log(user);
            console.log(reservatie.user);
            console.log("USER RESERVATIES");
            console.log(user.reservaties);
            user.reservaties.addToSet(reservatie);
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json(user);
            });
        });
    });

    router.get('/api/reservaties/user/:user', function (req, res) {
        res.json(req.reservaties);
    });

    router.param('user', function (req, res, next, id) {
        var query = User.findById(id).populate('reservaties');

        query.exec(function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error('can\'t find reservaties'));
            }

            req.reservaties = user.reservaties;
            return next();
        });
    });
    //endregion

    //region ruimtes
    

    //endregion

    module.exports = router;

})();
