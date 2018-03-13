(function () {

    'use strict';

    var mongoose = require('mongoose');
    var express = require('express');
    var ObjectId = require('mongoose').Types.ObjectId;

    var router = express.Router();
    var Reservatie = mongoose.model('Reservatie');
    var User = mongoose.model('User');
    var Ruimte = mongoose.model('Ruimte');
    var EventType = mongoose.model('EventType');
    var Evenement = mongoose.model('Event');
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
        var noSpace = false;
        var reservatiesThisDay = {};
        var reservatie = new Reservatie(req.body);
        console.log(reservatie);
        console.log(reservatie.user);

        //Controle of reservatie nog mogelijk is.
        var nextDay = new Date(reservatie.startdate);
        nextDay.setDate(reservatie.startdate.getDate()+1);
        var query = Reservatie.find({'startdate': {'$gte':reservatie.startdate,"$lt": nextDay}}).populate('user');
        query.exec(function (err, reservaties) {
          reservatiesThisDay = reservaties;
          console.log("API Reservaties POST")
          console.log(reservaties);
          console.log(reservatiesThisDay);
          for(var item of reservatiesThisDay){
            //Hij gaat in de for loop
            console.log("INFOR")
            console.log(item);
            //De logs worden uitgevoerd.
            if(item.keuzeDag === "volledigedag"){
              console.log("in if");
              noSpace = true;
              break;
            } else if (item.keuzeDag === reservatie.keuzeDag) {
              noSpace = true;
              break;
            }
            //IF HET AANTAL BESCHIKBARE PLAATSEN IN DE RUIMTE, OP DIT MOMENT, < HET AANTAL NODIGE PLAATSEN
          }
            if (err) {
                return next(err);
            }
        }).then(function (que){
          console.log(reservatiesThisDay);


          //Einde controle
          if(noSpace === false) {
            console.log(noSpace);
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
          } else {
            return res.status(400).json({
                message: 'Geen plaats op het gekozen tijdstip.'
            });
          }
        });



    });

    router.get('/api/reservaties', function(req, res, next) {
      Reservatie.find(function(err, reservaties) {
        if(err){
          return next(err);
        }
        res.json(reservaties);
      }).populate('user');
    });

    router.param('date', function (req, res, next, date) {
        var day = new Date(date);
        day.setHours(0,0,0,0)
        console.log(date);
        var nextDay = new Date(date);
        nextDay.setDate(day.getDate()+1);
        var query = Reservatie.find({'startdate': {'$gte':day,"$lt": nextDay}}).populate('user');
        query.exec(function (err, reservaties) {
            if (err) {
                return next(err);
            }
            if (!reservaties) {
                return next(new Error('can\'t find reservations'));
            }
            req.reservaties = reservaties;
            return next();
        })
    });

    router.get('/api/reservaties/:date', function (req, res, next) {
        res.json(req.reservaties);
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
    router.post('/api/ruimtes', auth, function (req, res, next) {
        var ruimte = new Ruimte(req.body);
        console.log(ruimte);
        console.log(ruimte.name);
        ruimte.save(function (err, ruimte) {
            if (err) {
                return next(err);
            }
        });
    });

    router.get('/api/ruimtes', function (req, res, next) {
        Ruimte.find(function (err, ruimtes) {
            if (err) {
                return next(err);
            }
            res.json(ruimtes);
        });
    });

    //endregion

    //region EventTypes
    router.post('/api/eventtypes', auth, function(req, res, next){
      var eventType = new EventType(req.body);
      eventType.save(function(err, eventType) {
        if(err) {
          return next(err);
        }
      });
    });

    router.get('/api/eventtypes', function(req, res, next){
      EventType.find(function (err, eventtypes){
        if(err) {
          return next(err);
        }
        res.json(eventtypes);
      });
    });
    //endregion

    //region Events

    //GetAll
    router.get('/api/events', function(req, res, next) {
      Evenement.find(function(err, events) {
        if(err){
          return next(err);
        }
        res.json(events);
      }).populate('user').populate('ruimte').populate('eventType');
    });
    //Create
    router.post('/api/events', auth, function (req, res, next) {
        var evenement = new Evenement(req.body);
        console.log("in index");
        console.log(evenement);
        console.log(req.body);
        console.log(evenement.name);
        evenement.save(function (err, evenement) {
            if (err) {
                return next(err);
            }
        });
    });
    //endregion Events

    module.exports = router;

})();
