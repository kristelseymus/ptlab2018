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
        var hasreservation = false;

        var u = {}; //De user die wil reserveren
        var r = {}; //Alle reservaties op de gekozen dag
        var ru = {}; //De gewenste ruimte
        var e = {}; //Events die die dag plaatsvinden
        
        User.findOne({ '_id' : new ObjectId(reservatie.user) }).populate({path: 'reservaties', populate: {path: 'ruimte'}}).exec(function (err, user) {
          u = user;
          if (err) {
              return next(err);
          }
          Evenement.find({ 'startdate' : new Date(reservatie.startdate) }).exec(function (err, events) {
            e = events;
            if (err) {
                return next(err);
            }
            Reservatie.find({ 'startdate' : new Date(reservatie.startdate) }).populate('user').populate('ruimte').exec(function (err, reservaties) {
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
                  return next(new Error("U hebt al een reservatie op de gekozen dag."));
                } else {
                  //Nee ?
                    // ** CONTROLE 2: ZIJN ER EVENTS OP DE GEKOZEN DAG ?
                    if(e.length > 0){
                      //Ja ?
                        // ** CONTROLE 3: CHECK KEUZEDAG
                          //Gelijk of event keuzedag is 'volledigedag' ?
                            // !! Kan niet reserveren
                          for(var i=0; i<e.length; i++){
                            if(e[i].keuzeDag == "volledigedag" || e[i].keuzeDag == reservatie.keuzeDag){
                              return next(new Error("Er vindt een evenement plaats op het gekozen moment."));
                            }
                          }
                          //Niet gelijk & geen event met keuzedag 'volledigedag' ?
                            // ** CONTROLE 4: IS ER NOG EEN PLAATS ?
                              //Ja ?
                                // ++ Reserveer
                              //Nee ?
                                // !! Kan niet reserveren
                    } else {
                      //Nee ?
                        // ** CONTROLE 4: IS ER NOG EEN PLAATS ?
                          //Ja ?
                            // ++ Reserveer
                          //Nee ?
                            // !! Kan niet reserveren
                    }// Einde if(e.length > 0)
                }// Einde hasreservation
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

/*
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
*/

        //controles
        //Controles zulle hier worden uitgevoerd in plaats van de ReservatieController
        //Dit is beter dan controles op client side.

      /*  User.findOne({ '_id' : new ObjectId(reservatie.user) }).populate({path: 'reservaties', populate :{path: 'ruimte'}}).exec(function (err, user) {
            if (err) {
                return next(err);
            }
            //Heeft de user al een reservatie op de gekozen dag ?
            console.log(user);
            for(var i=0; i<user.reservaties.length; i++){
              console.log(user.reservaties[i].startdate);
              console.log(reservatie.startdate);
              if(user.reservaties[i].startdate.valueOf() == reservatie.startdate.valueOf()){
                console.log("zit in if dates gelijk");
                hasreservation = true;
              }
            }
            console.log(hasreservation);
            if(hasreservation){
              //User heeft een reservatie op de gekozen dag.
              //var r = new Error('U hebt al een reservatie op de gekozen dag.');
              res.render('error', { error: new Error('U hebt al een reservatie op de gekozen dag.') });
              //console.log(r);
              //console.log(r.message);
              //return next(r);
            }
            else {
              //User heeft GEEN reservatie op de gekozen dag.

              //Vinden er events plaats op de gekozen datum ?
              Evenement.find({ 'startdate' : new Date(reservatie.startdate) }).exec(function (err, events) {
                console.log("in find");
                console.log(events);
                if(events.length === 0){
                  //Er vinden geen events plaats op de gekozen dag.

                  //Is er nog plaats ?
                  //Alle reservaties van de gekozen dag ophalen
                  Reservatie.find({ 'startdate' : new Date(reservatie.startdate) }).populate('user').populate('ruimte').exec(function(err, reservaties){
                    var reservatiesruimte = [];
                    var temp = 0;
                    var voor = 0;
                    var na = 0;
                    var vol = 0;
                    var reser;

                    //Bij alle reservaties zal worden gekeken welke ruimte is gereserveerd.
                    //Alle reservaties met dezelfde ruimte als de gewenste ruimte,
                    //zullen worden toegevoegd aan de reservaties array.
                    if(!reservaties.length > 0){
                      //Geen reservaties, dus er is nog plaats.
                      //Hier mag gereserveerd worden.
                      user.reservaties.addToSet(reservatie);
                      user.save(function (err) {
                          if (err) {
                              return next(err);
                          }
                      });
                      reservatie.save(function (err, reservatie) {
                          if (err) {
                              return next(err);
                          }
                      });

                    } else {
                      reservaties.forEach(function(reserv){
                        if(reserv.ruimte._id === reservatie.ruimte){
                          reservatiesruimte.push(reserv);
                        }
                      });
                    }
                    if(!reservatiesruimte.length > 0){
                      //Als reservatiesruimte leeg is, dan zijn er geen reservaties opgeslagen in deze ruimte op deze dag.
                      //Er is nog plaats, dus reserveer.
                      user.reservaties.addToSet(reservatie);
                      user.save(function (err) {
                          if (err) {
                              return next(err);
                          }
                      });
                      reservatie.save(function (err, reservatie) {
                          if (err) {
                              return next(err);
                          }
                      });
                    }

                    if(reservatie.keuzeDag === 'volledigedag'){
                      //Wanneer er voor een volledige dag gekozen wordt, dienen er andere controles uitgevoerd te worden.
                      reservatiesruimte.forEach(function(reser){
                        if(reser.keuzeDag === 'voormiddag'){ voor += 1; }
                        else if(reser.keuzeDag === 'namiddag'){ na += 1; }
                        else if(reser.keuzeDag === 'volledigedag'){ vol += 1; }
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
                      reservatiesruimte.forEach(function(reser){
                        if(reservatie.keuzeDag === reser.keuzeDag || reser.keuzeDag === 'volledigedag'){
                          temp += 1;
                        }
                      });
                    }
                    Ruimte.findOne({ '_id' : reservatie.ruimte }).exec(function(err, ruimte){
                      if(ruimte.aantalPlaatsen - temp > 0){
                        //Er is nog plaats in de ruimte.
                        //Reserveer.
                        user.reservaties.addToSet(reservatie);
                        user.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                        });
                        reservatie.save(function (err, reservatie) {
                            if (err) {
                                return next(err);
                            }
                        });
                      } else {
                        return next(new Error('Er is geen plaats meer in deze ruimte.'));
                      }
                    });//Einde ruimte.findOne
                  });//Einde reservatie.find
                }
                else {
                  //Er vinden wel events plaats op de gekozen dag.
                  for(var i=0; i<events.length; i++){
                    if(events[i].keuzeDag === 'volledigedag' || events[i].keuzeDag === reservatie.keuzeDag){
                      //Er vind een event plaats op het gekozen deel van de dag.
                      return next(new Error('Er vind een evenement plaats op het gekozen moment.'));
                    }
                  }
                  //Uit for dus er vind geen event plaats op het gekozen deel van de dag.
                  //Is er nog plaats ?
                  //Alle reservaties van de gekozen dag ophalen
                  Reservatie.find({ 'startdate' : new Date(reservatie.startdate) }).populate('user').populate('ruimte').exec(function(err, reservaties){
                    var reservatiesruimte = [];
                    var temp = 0;
                    var voor = 0;
                    var na = 0;
                    var vol = 0;
                    var reser;

                    if(!reservaties.length > 0){
                      user.reservaties.addToSet(reservatie);
                      user.save(function (err) {
                          if (err) {
                              return next(err);
                          }
                      });
                      reservatie.save(function (err, reservatie) {
                          if (err) {
                              return next(err);
                          }
                      });

                    } else {
                      reservaties.forEach(function(reserv){
                        if(reserv.ruimte._id === reservatie.ruimte){
                          reservatiesruimte.push(reserv);
                        }
                      });
                    }
                    if(!reservatiesruimte.length > 0){
                      user.reservaties.addToSet(reservatie);
                      user.save(function (err) {
                          if (err) {
                              return next(err);
                          }
                      });
                      reservatie.save(function (err, reservatie) {
                          if (err) {
                              return next(err);
                          }
                      });
                    }

                    if(reservatie.keuzeDag === 'volledigedag'){
                      reservatiesruimte.forEach(function(reser){
                        if(reser.keuzeDag === 'voormiddag'){ voor += 1; }
                        else if(reser.keuzeDag === 'namiddag'){ na += 1; }
                        else if(reser.keuzeDag === 'volledigedag'){ vol += 1; }
                      });
                      if (voor > na){
                        temp = vol + voor;
                      } else{
                        temp = vol + na;
                      }
                    } else {
                      reservatiesruimte.forEach(function(reser){
                        if(reservatie.keuzeDag === reser.keuzeDag || reser.keuzeDag === 'volledigedag'){
                          temp += 1;
                        }
                      });
                    }
                    Ruimte.findOne({ '_id' : reservatie.ruimte }).exec(function(err, ruimte){
                      if(ruimte.aantalPlaatsen - temp > 0){
                        user.reservaties.addToSet(reservatie);
                        user.save(function (err) {
                            if (err) {
                                return next(err);
                            }
                        });
                        reservatie.save(function (err, reservatie) {
                            if (err) {
                                return next(err);
                            }
                        });
                      } else {
                        return next(new Error('Er is geen plaats meer in deze ruimte.'));
                      }
                    });//Einde ruimte.findOne
                  });//Einde reservatie.find
                }//Einde else events op gekozen deel dag
              }); //Einde evenement.find

            }//Einde if(hasreservation)
        }); //Einde User.findOne */
    });// EINDE POST

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
