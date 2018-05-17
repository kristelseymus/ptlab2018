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
    var BlockedDates = mongoose.model('BlockedDates');
    var Content = mongoose.model('Content');
    var passport = require('passport');
    var jwt = require('express-jwt');
    var nodemailer = require('nodemailer');
    var ejs = require('ejs');
    var path = require('path');
    var moment = require('moment');
    var auth = jwt({
        secret: 'SECRET',
        userProperty: 'payload'
    });

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

    /* GET index page. */
    router.get('/', function (req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });
    /* GET home page. */
    router.get('/home', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET voorwie section on home page. */
    router.get('/home#voorwie', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET ruimtes section on home page. */
    router.get('/home#ruimtes', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET prijzen section on home page. */
    router.get('/home#prijzen', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET practicals section on home page. */
    router.get('/home#practicals', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET agenda section on home page. */
    router.get('/home#agenda', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET contact page. */
    router.get('/contact', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET login page. */
    router.get('/login', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET register page. */
    router.get('/register', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET changepassword page */
    router.get('/changepassword', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      })
    });
    /* GET settings page. */
    router.get('/settings', function(req, res, next) {
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET boekplaatsstudent page. */
    router.get('/boekplaatsstudent', function(req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET vraagofferteaan page. */
    router.get('/vraagofferteaan', function(req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET gratisplaats page. */
    router.get('/gratisplaats', function(req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET mijnreservaties page. */
    router.get('/mijnreservaties', function(req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET updatewebsite page. */
    router.get('/updatewebsite', function (req, res, next){
      res.render('index', {
        title: 'Express'
      });
    });
    /* GET forgot password page. */
    router.get('/forgot', function(req, res) {
      res.render('index', {
        user: req.user
      });
    });
    /* GET forgot password page for user. */
    router.get('/reset/:token', function(req, res){
      User.findOne({ 'resetPasswordToken' : req.params.token, 'resetPasswordExpires': { '$gt': Date.now() } }, function(err, user) {
        if(!user) {// If there is no user found with the same token or an expiration date lower then or equal to Date.now()
          res.redirect('/tokeninvalid');
          //res.render('index', { message: 'The reset token is not valid or is expired.', error: {status: 400}});
        } else {
          res.render('index', {
            user: user
          });
        }
      });
    });
    /* GET token invalid page */
    router.get('/tokeninvalid', function(req, res){
      res.render('index', {
        title: 'Express'
      });
    });

    //REGION RESERVATIES

    /* GET reservaties */
    router.get('/api/reservaties', function(req, res, next) {
      Reservatie.find(function(err, reservaties) {
        if(err){
          return next(err);
        }
        res.json(reservaties);
      }).populate('user').populate('ruimte');
    });
    /* GET reservaties on specific date. */
    router.get('/api/reservaties/:date', function (req, res, next) {
        res.json(req.reservaties);
    });
    router.param('date', function (req, res, next, date) {
        var day = moment(date).toDate();
        var nextDay = moment(date).add(1, 'd').toDate();
        console.log(day);
        console.log(nextDay);

        var query = Reservatie.find({'startdate': {'$gte':day,'$lt': nextDay}}).populate('user').populate('ruimte');
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
    /* GET reservaties from specific user */
    router.get('/api/reservaties/user/:user', function (req, res) {
        res.json(req.reservaties);
    });
    router.param('user', function (req, res, next, id) {
        var query = User.findById(id).populate({path: 'reservaties', populate :{path: 'ruimte user'}});

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
    /* GET reservaties from a specific date in a specific room */
    router.get('/api/reservaties/:date/:ruimte', function(req, res, next) {
      var day = moment(req.params.date).toDate();
      var nextDay = moment(req.params.date).add(1, 'd').toDate();
      var query = Reservatie.find({'startdate': {'$gte':day,'$lt': nextDay}, 'ruimte': req.params.ruimte});
      query.exec(function (err, reservaties) {
          if (err) {
              return next(err);
          }
          if (!reservaties) {
              return next(new Error('can\'t find reservations'));
          }
          req.reservaties = reservaties;
          res.json(req.reservaties);
      });
    });
    /* POST add reservatie */
    router.post('/api/reservaties', auth, function (req, res, next) {
        var reservatie = new Reservatie(req.body);
        var hasreservation = false;
        var reserve = false;

        var u = {}; //De user die wil reserveren
        var r = {}; //Alle reservaties op de gekozen dag
        var ru = {}; //De gewenste ruimte
        var e = {}; //Events die die dag plaatsvinden
        var plaatsen = 0;
        var temp = 0; //Voor de plaatsberekening
        var voor = 0; //Voor de plaatsberekening
        var na = 0; //Voor de plaatsberekening
        var vol = 0; //Voor de plaatsberekening
        var day = moment(reservatie.startdate).toDate();
        var nextDay = moment(reservatie.startdate).add(1, 'd').toDate();

        User.findById(reservatie.user).populate({path: 'reservaties', populate: {path: 'ruimte'}}).exec(function (err, user) {
          u = user;
          if (err) {
              return next(err);
          }
          Evenement.find({'startdate': {'$gte':day,"$lt": nextDay}, 'ruimte': reservatie.ruimte}).exec(function (err, events) {
            e = events;
            if (err) {
                return next(err);
            }
            Reservatie.find({'startdate': {'$gte':day,"$lt": nextDay}, 'ruimte': reservatie.ruimte}).populate('user').populate('ruimte').exec(function (err, reservaties) {
              r = reservaties;
              if (err) {
                  return next(err);
              }
              Ruimte.findOne({ '_id' : reservatie.ruimte }).exec(function (err, ruimte) {
                ru = ruimte;
                if (err) {
                    return next(err);
                }
                //CONTROLES
                  // ** CONTROLE 1: HEEFT USER AL RESERVATIES ?
                for(var i=0; i<u.reservaties.length; i++){
                  if(u.reservaties[i].startdate.valueOf() == reservatie.startdate.valueOf()){
                    hasreservation = true;
                  }
                }

                if(hasreservation){
                  //Ja ?
                    // !! Kan niet reserveren
                  return res.status(400).json({
                    message: 'U hebt al een reservatie op de gekozen dag. Gelieve een ander moment te kiezen.'
                  });
                } else {
                  //Nee ?
                    // ** CONTROLE 2: ZIJN ER EVENTS OP DE GEKOZEN DAG ?
                    if(e.length > 0){
                      //Ja ?
                        // ** CONTROLE 3: CHECK KEUZEDAG
                          //Gelijk of event keuzedag is 'volledigedag' ?
                            // !! Kan niet reserveren
                          for(var i=0; i<e.length; i++){
                            if(e[i].keuzeDag == "volledigedag" || reservatie.keuzeDag == "volledigedag" || e[i].keuzeDag == reservatie.keuzeDag){
                              return res.status(400).json({
                                message: 'Er vindt een evenement plaats op het gekozen moment. Gelieve een ander moment te kiezen.'
                              });
                            }
                          }
                          //Niet gelijk & geen event met keuzedag 'volledigedag' ?
                            // ** CONTROLE 4: IS ER NOG EEN PLAATS ?

                          //Plaatsberekening
                          //Bij alle reservaties zal worden gekeken welke ruimte is gereserveerd.
                          //Alle reservaties met dezelfde ruimte als de gewenste ruimte,
                          //zullen worden toegevoegd aan de reservaties array.
                          temp = 0; vol = 0; na = 0; voor = 0;
                          if(!r.length > 0){
                            //Geen reservaties op de gekozen datum en in de gekozen ruimte
                            plaatsen = ru.aantalPlaatsen;
                          } else {
                            //Er zijn 1 of meerdere reservaties gevonden op de gekozen dag en in de gekozen ruimte
                              if(reservatie.keuzeDag === 'volledigedag'){
                                //Wanneer er voor een volledige dag gekozen wordt, dienen er andere controles uitgevoerd te worden.
                                r.forEach(function(res){
                                  if(res.keuzeDag === 'voormiddag'){ voor += 1; }
                                  else if(res.keuzeDag === 'namiddag'){ na += 1; }
                                  else if(res.keuzeDag === 'volledigedag'){ vol += 1; }
                                });
                                if (voor > na){
                                  //Als het aantal reservering in de voormiddag groter zijn dan het aantal in de namiddag,
                                  //zal het aantal van de voormiddag gebruikt worden als vermindering voor het aantal beschikbare plaatsen.
                                  //Dit is ook zo indien namiddag > voormiddag, dan zal namiddag gebruikt worden.

                                  //Het aantal beschikbare plaatsen op het gekozen moment zal dan gelijk zijn aan
                                  //het totaal beschikbare in de ruimte - vol (aantal volledige) - voor (of na)
                                  temp = vol + voor;
                                } else{
                                  //Namiddag is groter of gelijk aan voormiddag.
                                  temp = vol + na;
                                }
                              } else {
                                 //Er werd geen volledige dag gekozen.
                                r.forEach(function(res){
                                  if(reservatie.keuzeDag === res.keuzeDag || res.keuzeDag === 'volledigedag'){
                                    temp += 1;
                                  }
                                });
                              }
                              plaatsen = ru.aantalPlaatsen - temp;
                          }
                          //Einde Plaatsberekening

                          if(plaatsen > 0){
                            //Ja ?
                              // ++ Reserveer
                              reserve = true;
                          } else {
                            //Nee ?
                              // !! Kan niet reserveren
                            return res.status(400).json({
                              message: 'Er is helaas geen plaats meer. Gelieve een ander moment te kiezen.'
                            });
                          }
                    } else {
                      //Nee ?
                        // ** CONTROLE 4: IS ER NOG EEN PLAATS ?
                        //Plaatsberekening
                        temp = 0; vol = 0; na = 0; voor = 0;
                        if(!r.length > 0){
                          plaatsen = ru.aantalPlaatsen;
                        } else {
                            if(reservatie.keuzeDag === 'volledigedag'){
                              r.forEach(function(res){
                                if(res.keuzeDag === 'voormiddag'){ voor += 1; }
                                else if(res.keuzeDag === 'namiddag'){ na += 1; }
                                else if(res.keuzeDag === 'volledigedag'){ vol += 1; }
                              });
                              if (voor > na){
                                temp = vol + voor;
                              } else{
                                temp = vol + na;
                              }
                            } else {
                              r.forEach(function(res){
                                if(reservatie.keuzeDag === res.keuzeDag || res.keuzeDag === 'volledigedag'){
                                  temp += 1;
                                }
                              });
                            }
                            plaatsen = ru.aantalPlaatsen - temp;
                        }
                        //Einde Plaatsberekening
                        if(plaatsen > 0){
                          reserve = true;
                        } else {
                          return res.status(400).json({
                            message: 'Er is helaas geen plaats meer. Gelieve een ander moment te kiezen.'
                          });
                        }
                    }// Einde if(e.length > 0)
                }// Einde hasreservation

                if(reserve){
                  //Als er kan gereserveerd worden dan zal de reserbatie opgeslagen worden
                  //in de databank. Wanneer dit niet zo is, zal er niets gebeuren.
                  reservatie.save(function (err, reservatie) {
                      if (err) {
                          return next(err);
                      }
                  });
                  u.reservaties.addToSet(reservatie);
                  u.save(function (err) {
                      if (err) {
                          res.send(err);
                      }
                      res.json(u);
                  });
                }
              }); // Einde Ruimte.findOne
            }); // Einde Reservatie.find
          }); // Einde Evenement.find
        }); // Einde User.findOne

        //CONTROLES
          // ** CONTROLE 1: HEEFT USER AL RESERVATIES ?
            //Ja ?
              // !! Kan niet reserveren
            //Nee ?
              // ** CONTROLE 2: ZIJN ER EVENTS OP DE GEKOZEN DAG ?
                //Ja ?
                  // ** CONTROLE 3: CHECK KEUZEDAG
                    //Gelijk of event keuzedag is 'volledigedag' ?
                      // !! Kan niet reserveren
                    //Niet gelijk & geen event met keuzedag 'volledigedag' ?
                      // ** CONTROLE 4: IS ER NOG EEN PLAATS ?
                        //Ja ?
                          // ++ Reserveer
                        //Nee ?
                          // !! Kan niet reserveren
                //Nee ?
                  // ** CONTROLE 4: IS ER NOG EEN PLAATS ?
                    //Ja ?
                      // ++ Reserveer
                    //Nee ?
                      // !! Kan niet reserveren
    });
    /* UPDATE reservatie */
    router.put('/api/reservaties/:reservatie', auth, function (req, res, next) {
        Reservatie.findById(req.body._id, function (err, reservatie) {
            if (err) {
                res.send(err);
            }
            reservatie.ruimte = req.body.ruimte;
            reservatie.keuzeDag = req.body.keuzeDag;
            reservatie.startdate = req.body.startdate;

            var reserve = false;
            var u = {}; //De user die wil reserveren
            var r = {}; //Alle reservaties op de gekozen dag
            var ru = {}; //De gewenste ruimte
            var e = {}; //Events die die dag plaatsvinden
            var plaatsen = 0;
            var day = moment(reservatie.startdate).toDate();
            var nextDay = moment(reservatie.startdate).add(1, 'd').toDate();

            User.findById(reservatie.user).populate({path: 'reservaties', populate: {path: 'ruimte'}}).exec(function (err, user) {
              u = user;
              if (err) {
                  return next(err);
              }
              Evenement.find({'startdate': {'$gte':day,"$lt": nextDay}, 'ruimte': reservatie.ruimte}).exec(function (err, events) {
                e = events;
                if (err) {
                    return next(err);
                }
                Reservatie.find({'_id': {'$ne': reservatie._id}, 'startdate': {'$gte':day,"$lt": nextDay}, 'ruimte': reservatie.ruimte}).populate('user').populate('ruimte').exec(function (err, reservaties) {
                  r = reservaties;
                  if (err) {
                      return next(err);
                  }
                  Ruimte.findOne({ '_id' : reservatie.ruimte }).exec(function (err, ruimte) {
                    ru = ruimte;
                    if (err) {
                        return next(err);
                    }
                    console.log(e);
                    console.log(u);
                    console.log(r);
                    console.log(ru);
                    console.log(reservatie);
                    if(e.length > 0){
                      console.log("EVENEMENTEN");
                          for(var i=0; i<e.length; i++){
                            if(e[i].keuzeDag == "volledigedag" || reservatie.keuzeDag == "volledigedag" || e[i].keuzeDag == reservatie.keuzeDag){
                              return res.status(400).json({
                                message: 'Er vindt een evenement plaats op het gekozen moment.'
                              });
                            }
                          }
                          plaatsen = berekenBeschikbarePlaatsen(ru, r, reservatie);

                          if(plaatsen > 0){
                            reserve = true;
                          } else {
                            reserve = false;
                          }
                    } else {
                      console.log("GEEN EVENEMENTEN");
                        plaatsen = berekenBeschikbarePlaatsen(ru, r, reservatie);
                        console.log(plaatsen);
                        if(plaatsen > 0){
                          reserve = true;
                        } else {
                          reserve = false;
                        }
                    }
                    if(reserve){
                      reservatie.ruimte = req.body.ruimte;
                      reservatie.startdate = req.body.startdate;
                      reservatie.keuzeDag = req.body.keuzeDag;
                      reservatie.save(function (err, reservatie) {
                          if (err) {
                              res.send(err);
                          }
                          res.json(reservatie);
                      })
                    } else {
                      return res.status(400).json({
                        message: 'Er is geen plaats meer.'
                      });
                    }
                  }); // Einde Ruimte.findOne
                }); // Einde Reservatie.find
              }); // Einde Evenement.find
            }); // Einde User.findOne


            /*console.log(checkReservationCanBeMade(req.body));
            var temp = checkReservationCanBeMade(req.body)
            console.log(temp);
            if(temp){
              reservatie.ruimte = req.body.ruimte;
              reservatie.startdate = req.body.startdate;
              reservatie.keuzeDag = req.body.keuzeDag;
              reservatie.save(function (err, reservatie) {
                  if (err) {
                      res.send(err);
                  }
                  res.json(reservatie);
              })
            } else {
              return res.status(400).json({
                message: 'Er is geen plaats/Er vindt een evenement plaats op het gekozen moment.'
              });
            }*/
        });
    });


    /* DELETE reservatie */
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

    //END REGION RESERVATIES

    //REGION RUIMTES
    /* GET ruimtes */
    router.get('/api/ruimtes', function (req, res, next) {
        Ruimte.find({}).sort('name').exec(
          function (err, ruimtes) {
              if (err) {
                  return next(err);
              }
              res.json(ruimtes);
          }
        );
    });
    /* POST add ruimte */
    router.post('/api/ruimtes', auth, function (req, res, next) {
        var ruimte = new Ruimte(req.body);
        ruimte.save(function (err, ruimte) {
            if (err) {
                return next(err);
            }
        });
    });
    /* PUT update ruimte */
    router.put('/api/ruimtes/:ruimte', auth, function (req, res) {
        Ruimte.findById(req.body._id, function (err, ruimte) {
            if (err) {
                res.send(err);
            }
            ruimte.name = req.body.name;
            ruimte.aantalPlaatsen = req.body.aantalPlaatsen;
            ruimte.beschrijving = req.body.beschrijving;
            ruimte.price = req.body.price;
            ruimte.priceperperson = req.body.priceperperson;
            ruimte.elektriciteitsaansluitingen = req.body.elektriciteitsaansluitingen;
            ruimte.internetavailable = req.body.internetavailable;
            ruimte.coffeewateravailable = req.body.coffeewateravailable;
            ruimte.printeravailable = req.body.printeravailable;
            ruimte.imagelink = req.body.imagelink;
            ruimte.save(function (err, ruimte) {
                if (err) {
                    res.send(err);
                }
                res.json(ruimte);
            })
        });
    });

    //END REGION RUIMTES

    //REGION EVENTTYPES

    /* GET eventtypes */
    router.get('/api/eventtypes', function(req, res, next){
      EventType.find(function (err, eventtypes){
        if(err) {
          return next(err);
        }
        res.json(eventtypes);
      });
    });
    /* POST add eventtype */
    router.post('/api/eventtypes', auth, function(req, res, next){
      var eventType = new EventType(req.body);
      eventType.save(function(err, eventType) {
        if(err) {
          return next(err);
        }
      });
    });

    //END REGION EVENTTYPES

    //REGION EVENTS

    /* GET events */
    router.get('/api/events', function(req, res, next) {
      Evenement.find(function(err, events) {
        if(err){
          return next(err);
        }
        res.json(events);
      }).populate('user').populate('ruimte').populate('eventType');
    });
    /* GET specific event by day */
    router.get('/api/events/:day', function (req, res, next) {
        res.json(req.events);
    });
    router.param('day', function (req, res, next, date) {
        var day = moment(date).toDate();
        var nextDay = moment(date).add(1, 'd').toDate();
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
    /* GET events after a given date in a specific room */
    router.get('/api/events/:date/:ruimte', function(req, res, next) {
      var date = moment(req.params.date).toDate();
      Evenement.find({'startdate': {'$gte':date}, 'ruimte': req.params.ruimte},function(err, events) {
        if(err){
          return next(err);
        }
        res.json(events);
      }).populate('user').populate('ruimte').populate('eventType').sort('startdate');
    });
    /* POST add event */
    router.post('/api/events', auth, function (req, res, next) {
        var evenement = new Evenement(req.body);
        var day = moment(evenement.startdate).startOf('day').toDate();
        var nextDay = moment(evenement.startdate).startOf('day').add(1, 'd').toDate();
        console.log(day);
        console.log(nextDay);
        var query = User.findById(evenement.user);
        var queryEvents = Evenement.find({'startdate': {'$gte':day,"$lt": nextDay}, 'ruimte': evenement.ruimte});
        var queryReservations = Reservatie.find({'startdate': {'$gte':day,"$lt": nextDay}, 'ruimte': evenement.ruimte}).populate('user').populate('ruimte');

        query.exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
              return res.status(400).json({
                message: 'De gevraagde gebruiker kan helaas niet gevonden worden. Probeer opnieuw.'
              });
            }
            queryEvents.exec(function(err, events){
              if(err) {
                return next(err);
              }
              queryReservations.exec(function(err, reservaties){
                if(events.length > 0){
                  for(var i=0; i<events.length; i++){
                    if(events[i].keuzeDag == "volledigedag" || evenement.keuzeDag == "volledigedag" || events[i].keuzeDag == evenement.keuzeDag){
                      return res.status(400).json({
                        message: 'Er vindt al een evenement plaats op het gekozen moment.'
                      });
                    }
                  }
                  if(reservaties.length > 0) {
                    for(var i = 0; i < reservaties.length; i++){
                      if(reservaties[i].keuzeDag == "volledigedag" || evenement.keuzeDag == "volledigedag" || reservaties[i].keuzeDag == evenement.keuzeDag){
                        return res.status(400).json({
                          message: 'Er zijn reeds reservaties geboekt op het gekozen moment.'
                        });
                      }
                    }
                    evenement.save(function (err, evenement) {
                      if(err) {
                        return next(err);
                      }
                    });
                    user.events.addToSet(evenement);
                    user.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(user);
                    });
                  } else {
                    evenement.save(function (err, evenement) {
                      if(err) {
                        return next(err);
                      }
                    });
                    user.events.addToSet(evenement);
                    user.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(user);
                    });
                  }
                } else {
                  if(reservaties.length > 0) {
                    for(var i = 0; i < reservaties.length; i++){
                      if(reservaties[i].keuzeDag == "volledigedag" || evenement.keuzeDag == "volledigedag" || reservaties[i].keuzeDag == evenement.keuzeDag){
                        return res.status(400).json({
                          message: 'Er zijn reeds reservaties geboekt op het gekozen moment.'
                        });
                      }
                    }
                    evenement.save(function (err, evenement) {
                      if(err) {
                        return next(err);
                      }
                    });
                    user.events.addToSet(evenement);
                    user.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(user);
                    });
                  } else {
                    evenement.save(function (err, evenement) {
                      if(err) {
                        return next(err);
                      }
                    });
                    user.events.addToSet(evenement);
                    user.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(user);
                    });
                  }
                }
              });
            });
        });
    });
    /* DELETE event */
    /*router.delete('/api/events/:evenement', auth, function (req, res, next) {
        Evenement.remove({
            _id: req.params.evenement
        }, function (err, evenement) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'Event deleted'
            });
        });
    });*/
    /* DELETE event */
    router.delete('/api/events/:evenement/:user', auth, function (req, res, next) {
        Evenement.remove({
            _id: req.params.evenement
        }, function (err, evenement) {
            if (err) {
                res.send(err);
            }
        });
        User.findById(req.params.user, function (err, user) {
            if (err) {
                res.send(err);
            }
            console.log(user);
            user.events.pull(req.params.evenement);
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'Event deleted'
                });
            })
        });
    });

    //END REGION EVENTS

    //REGION BLOCKEDDATES

    /* GET all blockeddates past this year (including the current year) */
    router.get('/api/blockeddates', function(req, res, next) {
      var today = moment();
      BlockedDates.find({'year' : {'$gte': today.year()}},function(err, blockeddates) {
        if(err){
          return next(err);
        }
        res.json(blockeddates);
      });
    });

    /* GET all blockeddates from a specific year */
    router.get('/api/blockeddates/:year', function(req, res, next) {
      BlockedDates.findOne({'year': req.params.year}, function(err, blockeddates) {
        if(err){
          return next(err);
        }
        res.json(blockeddates);
      });
    });

    /* POST create new blockeddates object for a year */
    router.post('/api/blockeddates', auth, function(req, res, next){
      var blockeddate = new BlockedDates(req.body);
      blockeddate.save(function(err, blockeddate) {
        if(err) {
          return next(err);
        }
      });
    });

    /* PUT add a date to the blockeddates of a year */
    router.put('/api/blockeddates/:blockeddates', auth, function (req, res) {
        BlockedDates.findOne({'year': req.body.year}, function (err, blockeddates) {
            if (err) {
                res.send(err);
            }
            console.log(req.body);
            blockeddates.blockeddates.push(req.body.blockeddate);
            blockeddates.save(function (err, blockeddates) {
                if (err) {
                    res.send(err);
                }
                res.json(blockeddates);
            })
        });
    });

    /* DELETE unblock a date */
    router.delete('/api/blockeddates/:year/:date', auth, function (req, res, next) {
        BlockedDates.findOne({'year': req.params.year}, function (err, blockeddates) {
            if (err) {
                res.send(err);
            }
            blockeddates.blockeddates.pull(req.params.date);
            blockeddates.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'Blockeddate deleted'
                });
            })
        });
    });

    //END REGION BLOCKEDDATES

    //REGION SENDMAIL

    /* POST sendmail */
    router.post('/api/sendmail', auth, function (req, res, next) {
        var mail = req.body;
        var item = mail.item;
        Content.findOne({}, 'adres', function(err, value){
          console.log(value.adres);
          /* SWITCH voor het verzenden van verschillende soorten emails */
          switch(mail.type) {
            case "confirmationreservation":
              console.log("confirmationreservation");
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/confirmationreservationemail.ejs'), { voornaam: item.user.voornaam, startdate: item.startdate, keuzeDag: item.keuzeDag, metfactuur: item.metfactuur, adres: value.adres, item: item, moment: moment }, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
                    text: "text", // plain text body
                    html: data, // html body
                    attachments: [{
                      filename: 'logo.jpg',
                      path: path.resolve(__dirname, '../public/images/Logo_PTLab-01.jpg'),
                      cid: 'logoimage' //same cid value as in the html<img<src
                    }]
                  };

                  transporter.sendMail(mailOptions, function(error, response){
                    if(error){
                      console.log(error);
                      res.end("error");
                    }else{
                      console.log("Message sent: " + response.message);
                      res.end("sent");
                    }
                  });
                }
              });
              break;
            case "confirmationoffer":
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/confirmationofferemail.ejs'), { voornaam: item.user.voornaam, naam: item.user.naam, email: item.user.username, offerte: item, adres: value.adres, moment: moment}, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  console.log(data);
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
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
                      res.end("sent");
                    }
                  });
                }
              });
              console.log("confirmationoffer");
              break;
            case "confirmationevent":
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/confirmationeventemail.ejs'), { voornaam: item.user.voornaam, naam: item.user.naam, email: item.user.username, item: item, adres: value.adres, moment: moment }, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  console.log(data);
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
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
                      res.end("sent")
                    }
                  });
                }
              });
              console.log("confirmationevent");
              break;
            case "cancellationreservation":
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/cancellationreservationemail.ejs'), { voornaam: item.user.voornaam, startdate: item.startdate, datedmy: item.datedmy, keuzeDag: item.keuzeDag, adres: value.adres, moment: moment }, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
                    text: "text", // plain text body
                    html: data, // html body
                    attachments: [{
                      filename: 'logo.jpg',
                      path: path.resolve(__dirname, '../public/images/Logo_PTLab-02.jpg'),
                      cid: 'logoimage' //same cid value as in the html<img<src
                    }]
                  };

                  transporter.sendMail(mailOptions, function(error, response){
                    if(error){
                      console.log(error);
                      res.end("error");
                    }else{
                      console.log("Message sent: " + response.message);
                      res.end("sent");
                    }
                  });
                }
              });
              console.log("cancellationreservation");
              break;
            case "cancellationevent":
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/cancellationeventemail.ejs'), { voornaam: item.user.voornaam, item: item, adres: value.adres, moment: moment}, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
                    text: "text",
                    html: data,
                    attachments: [{
                      filename: 'logo.jpg',
                      path: path.resolve(__dirname, '../public/images/Logo_PTLab-02.jpg'),
                      cid: 'logoimage'
                    }]
                  };

                  transporter.sendMail(mailOptions, function(error, response){
                    if(error){
                      console.log(error);
                      res.end("error");
                    } else {
                      console.log("Message sent: " + response.message);
                      res.end("sent")
                    }
                  });
                }
              });
              console.log("cancellationevent");
              break;
            case "invoicecoworker":
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/invoicecoworker.ejs'), { fullname: item.user.fullName, email: item.user.username, startdate: item.startdate, keuzeDag: item.keuzeDag, ruimte: item.ruimte.name, prijs: item.price, item: item, adres: value.adres, moment: moment }, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
                    text: "text", // plain text body
                    html: data, // html body
                    attachments: [{
                      filename: 'logo.jpg',
                      path: path.resolve(__dirname, '../public/images/Logo_PTLab-01.jpg'),
                      cid: 'logoimage' //same cid value as in the html<img<src
                    }]
                  };

                  transporter.sendMail(mailOptions, function(error, response){
                    if(error){
                      console.log(error);
                      res.end("error");
                    }else{
                      console.log("Message sent: " + response.message);
                      res.end("sent");
                    }
                  });
                }
              });
              console.log("invoicecoworker");
              break;
            case "invoicemanager":
              var totalprice = item.price + (item.priceperperson * item.aantalpersonen);
              var totalperperson = item.priceperperson * item.aantalpersonen;
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/invoicemanager.ejs'), { fullname: item.user.fullName, email: item.user.username, item: item, ruimte: item.ruimte.name, factuurnummer: mail.factuurnummer, totalprice: totalprice, totalperperson: totalperperson, adres: value.adres, moment: moment}, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
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
                      res.end("sent");
                    }
                  });
                }
              });
              console.log("invoicemanager")
              break;
            case "contactmail":
            console.log("contactmail");
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/contactemail.ejs'), { voornaam: item.voornaam, naam: item.naam, telefoon: item.telefoon, email: item.email, bericht: item.bericht, adres: value.adres, moment: moment }, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
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
                      res.end("sent");
                    }
                  });
                }
              });
              console.log("contact");
              break;
            case "offermail":
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/offeremail.ejs'), { voornaam: item.offerte.user.voornaam, naam: item.offerte.user.naam, email: item.offerte.user.username, offerte: item.offerte, item: item, adres: value.adres, moment: moment}, function(err, data){
                if(err){
                  console.log(err);
                } else {
                  console.log(data);
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
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
                      res.end("sent");
                    }
                  });
                }
              });
              console.log("offer");
              break;
            case "awaitingoffer":
              ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/awaitingoffer.ejs'), { voornaam: item.user.voornaam, naam: item.user.naam, email: item.user.username, offerte: item, adres: value.adres, moment: moment }, function(err, data) {
                if(err){
                  console.log(err);
                } else {
                  console.log(data);
                  var mailOptions = {
                    from: mail.from,
                    to: mail.to,
                    subject: mail.subject,
                    text: "text",
                    html: data,
                    attachments: [{
                      filename: 'logo.jpg',
                      path: path.resolve(__dirname, '../public/images/Logo_PTLab-03.jpg'),
                      cid: 'logoimage'
                    }]
                  };

                  transporter.sendMail(mailOptions, function(error, response) {
                    if(error){
                      console.log(error);
                      res.end("error");
                    } else {
                      console.log("Message sent: " + response.message);
                      res.end("sent");
                    }
                  });
                }
              });
              console.log("awaitingoffer");
              break;
            default: //Geen mail versturen.
              console.log("default");
              break;
          }
        });
    });

    //END REGION SENDMAIL

    //REGION WEBSITECONTENT

    /* GET website content (home page) */
    router.get('/api/content', function(req, res, next) {
      Content.findOne(function(err, content) {
        if(err){
          return next(err);
        }
        console.log(content);
        res.json(content);
      });
    });

    /* PUT update the website content */
    router.put('/api/content/:content', auth, function (req, res) {
        Content.findById(req.params.content,function (err, content) {
            if (err) {
                res.send(err);
            }
            content.home = req.body.home;
            content.voorwiemanager = req.body.voorwiemanager;
            content.voorwiecoworker = req.body.voorwiecoworker;
            content.voorwiestudent = req.body.voorwiestudent;
            content.imagevoorwie = req.body.imagevoorwie;
            content.practicals = req.body.practicals;
            content.openingsuren = req.body.openingsuren;
            content.adres = req.body.adres;
            content.save(function (err, content) {
                if (err) {
                    res.send(err);
                }
                res.json(content);
            })
        });
    });

    /* POST add a new website content object
    Only 1 can exist at the same time, so this api call is not available.
    The same website content object is updated everytime. A new object won't be created.
    */
    /*router.post('/api/content', auth, function (req, res, next) {
        var content = new Content(req.body);
        console.log(content);
        content.save(function (err, content) {
            if (err) {
                return next(err);
            }
        });
    });*/

    //END REGION WEBSITECONTENT

    //HELPER METHODS
    /*function checkReservationCanBeMade(item) {
      var reserve = false;
      var reservatie = new Reservatie(item);
      var u = {}; //De user die wil reserveren
      var r = {}; //Alle reservaties op de gekozen dag
      var ru = {}; //De gewenste ruimte
      var e = {}; //Events die die dag plaatsvinden
      var plaatsen = 0;
      var day = new Date(reservatie.startdate);
      day.setHours(0,0,0,0)
      var nextDay = new Date(reservatie.startdate);
      nextDay.setDate(day.getDate()+1);

      return User.findById(reservatie.user).populate({path: 'reservaties', populate: {path: 'ruimte'}}).exec(function (err, user) {
        u = user;
        if (err) {
            return next(err);
        }
        Evenement.find({'startdate': {'$gte':day,"$lt": nextDay}, 'ruimte': reservatie.ruimte}).exec(function (err, events) {
          e = events;
          if (err) {
              return next(err);
          }
          Reservatie.find({'_id': {'$ne': reservatie._id}, 'startdate': {'$gte':day,"$lt": nextDay}, 'ruimte': reservatie.ruimte}).populate('user').populate('ruimte').exec(function (err, reservaties) {
            r = reservaties;
            if (err) {
                return next(err);
            }
            Ruimte.findOne({ '_id' : reservatie.ruimte }).exec(function (err, ruimte) {
              ru = ruimte;
              if (err) {
                  return next(err);
              }
              console.log(e);
              console.log(u);
              console.log(r);
              console.log(ru);
              console.log(reservatie);
              if(e.length > 0){
                console.log("EVENEMENTEN");
                    for(var i=0; i<e.length; i++){
                      if(e[i].keuzeDag == "volledigedag" || e[i].keuzeDag == reservatie.keuzeDag){
                        reserve = false;
                      }
                    }
                    plaatsen = berekenBeschikbarePlaatsen(ru, r, reservatie);

                    if(plaatsen > 0){
                      reserve = true;
                    } else {
                      reserve = false;
                    }
              } else {
                console.log("GEEN EVENEMENTEN");
                  plaatsen = berekenBeschikbarePlaatsen(ru, r, reservatie);
                  console.log(plaatsen);
                  if(plaatsen > 0){
                    reserve = true;
                  } else {
                    reserve = false;
                  }
              }
              console.log(reserve);
              return reserve;
            }); // Einde Ruimte.findOne
          }); // Einde Reservatie.find
        }); // Einde Evenement.find
      }); // Einde User.findOne
    } // EINDE Check reservation*/

    function berekenBeschikbarePlaatsen(ruimte, reservaties, reservatie){
      var plaatsen = 0;
      var temp = 0; //Voor de plaatsberekening
      var voor = 0; //Voor de plaatsberekening
      var na = 0; //Voor de plaatsberekening
      var vol = 0; //Voor de plaatsberekening
      if(!reservaties.length > 0){
        plaatsen = ruimte.aantalPlaatsen;
      } else {
          if(reservatie.keuzeDag === 'volledigedag'){
            reservaties.forEach(function(res){
              if(res.keuzeDag === 'voormiddag'){ voor += 1; }
              else if(res.keuzeDag === 'namiddag'){ na += 1; }
              else if(res.keuzeDag === 'volledigedag'){ vol += 1; }
            });
            if (voor > na){
              temp = vol + voor;
            } else{
              temp = vol + na;
            }
          } else {
            reservaties.forEach(function(res){
              if(reservatie.keuzeDag === res.keuzeDag || res.keuzeDag === 'volledigedag'){
                temp += 1;
              }
            });
          }
          console.log(reservatie);
          console.log("ruimte: " + ruimte.aantalPlaatsen);
          console.log("temp: " + temp);
          plaatsen = ruimte.aantalPlaatsen - temp;
      }
      //Einde Plaatsberekening
      return plaatsen;
    }

    module.exports = router;

})();
