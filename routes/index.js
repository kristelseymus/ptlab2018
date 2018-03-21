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
        var reservatie = new Reservatie(req.body);

        reservatie.save(function (err, reservatie) {
            if (err) {
                return next(err);
            }
        });
        User.findOne({ '_id' : new ObjectId(reservatie.user) }).exec(function (err, user) {
            if (err) {
                res.send(err);
            }
            user.reservaties.addToSet(reservatie);
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json(user);
            });
        });
    });

    router.get('/api/reservaties', function(req, res, next) {
      Reservatie.find(function(err, reservaties) {
        if(err){
          return next(err);
        }
        res.json(reservaties);
      }).populate('user').populate('ruimte');
    });

    router.param('date', function (req, res, next, date) {
        var day = new Date(date);
        day.setHours(0,0,0,0)
        console.log(date);
        var nextDay = new Date(date);
        nextDay.setDate(day.getDate()+1);
        var query = Reservatie.find({'startdate': {'$gte':day,"$lt": nextDay}}).populate('user').populate('ruimte');
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
        var query = User.findById(id).populate({path: 'reservaties', populate :{path: 'ruimte'}});

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
    //Delete reservatie
    router.delete('/api/reservaties/:reservatie/:user', auth, function (req, res, next) {
        Reservatie.remove({
            _id: req.params.reservatie
        }, function (err, reservatie) {
            if (err) {
                res.send(err);
            }
        });

        User.findById(req.params.user, function (err, user) {
            if (err) {
                res.send(err);
            }
            user.reservaties.pull(req.params.reservatie);
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'Reservatie deleted'
                });
            })
        });
    });

    //
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
        var query = User.findById(evenement.user);
        query.exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error('can\'t find user'));
            }
            console.log(evenement);
            if(user.isAdmin){
              evenement.save(function (err, evenement) {
                  if (err) {
                      return next(err);
                  }
              });
            } else {
              return next(new Error('U moet een admin zijn om een event aan te maken'));
            }
            return next();
        });
    });
    //Get by day
    router.param('day', function (req, res, next, date) {
        var day = new Date(date);
        day.setHours(0,0,0,0)
        console.log(date);
        var nextDay = new Date(date);
        nextDay.setDate(day.getDate()+1);
        var query = Evenement.find({'startdate': {'$gte':day,"$lt": nextDay}}).populate('user').populate('ruimte').populate('eventType');
        query.exec(function (err, events) {
            if (err) {
                return next(err);
            }
            if (!events) {
                return next(new Error('can\'t find events'));
            }
            req.events = events;
            return next();
        });
    });

    router.get('/api/events/:day', function (req, res, next) {
        res.json(req.events);
    });
    //endregion Events

    //region Contact
    /*app.post('/sendcontact', function (req, res) {
    var data=req.body;

    var smtpTransport = nodemailer.createTransport("SMTP",{
       service: "Gmail",
       auth: {
       user: "email@gmail.com",
       pass: "gmailPassword"
       }});

   smtpTransport.sendMail({  //email options
   from: "Sender Name <email@gmail.com>",
   to: "Receiver Name <receiver@email.com>", // receiver
   subject: "Emailing with nodemailer", // subject
   html: "here your data goes" // body (var data which we've declared)
    }, function(error, response){  //callback
         if(error){
           console.log(error);
        }else{
           console.log("Message sent: " + res.message);
       }

   smtpTransport.close();
 }); });*/
    //endregion

    module.exports = router;

})();
