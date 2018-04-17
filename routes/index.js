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
        var day = new Date(date);
        day.setHours(0,0,0,0)
        console.log(date);
        var nextDay = new Date(date);
        //nextDay.setDate(date.getDate()+1);
        nextDay.setHours(day.getHours() + 24)
        console.log(new Date(day));
        console.log(new Date(nextDay));
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
        var day = new Date(reservatie.startdate);
        day.setHours(0,0,0,0)
        var nextDay = new Date(reservatie.startdate);
        nextDay.setDate(day.getDate()+1);

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
                            if(e[i].keuzeDag == "volledigedag" || e[i].keuzeDag == reservatie.keuzeDag){
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
        Ruimte.find(function (err, ruimtes) {
            if (err) {
                return next(err);
            }
            res.json(ruimtes);
        });
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
    /* POST add event */
    router.post('/api/events', auth, function (req, res, next) {
        var evenement = new Evenement(req.body);
        var query = User.findById(evenement.user);
        query.exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
              return res.status(400).json({
                message: 'De gevraagde gebruiker kan helaas niet gevonden worden. Probeer opnieuw.'
              });
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
        });
    });
    /* DELETE event */
    router.delete('/api/events/:evenement', auth, function (req, res, next) {
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
    });
    /* DELETE event in user */
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

    //REGION SENDMAIL

    /* POST sendmail */
    router.post('/api/sendmail', auth, function (req, res, next) {
        var mail = req.body;
        var item = mail.item;
        /* SWITCH voor het verzenden van verschillende soorten emails */
        switch(mail.type) {
          case "confirmationreservation":
            console.log("confirmationreservation");
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/confirmationreservationemail.ejs'), { voornaam: item.user.voornaam, startdate: item.startdate, keuzeDag: item.keuzeDag, metfactuur: item.metfactuur, moment: moment }, function(err, data){
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
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/confirmationofferemail.ejs'), { voornaam: item.user.voornaam, naam: item.user.naam, email: item.user.username, offerte: item, moment: moment}, function(err, data){
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
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/confirmationeventemail.ejs'), { voornaam: item.user.voornaam, naam: item.user.naam, email: item.user.username, item: item, moment: moment }, function(err, data){
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
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/cancellationreservationemail.ejs'), { voornaam: item.user.voornaam, startdate: item.startdate, keuzeDag: item.keuzeDag, moment: moment }, function(err, data){
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
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/cancellationeventemail.ejs'), { voornaam: item.user.voornaam, item: item, moment: moment}, function(err, data){
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
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/invoicecoworker.ejs'), { fullname: item.user.fullName, email: item.user.username, startdate: item.startdate, keuzeDag: item.keuzeDag, ruimte: item.ruimte.name, prijs: item.price, factuurnummer: mail.factuurnummer, moment: moment }, function(err, data){
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
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/invoicemanager.ejs'), { fullname: item.user.fullName, email: item.user.username, item: item, factuurnummer: mail.factuurnummer, moment: moment }, function(err, data){
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
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/contactemail.ejs'), { voornaam: item.voornaam, naam: item.naam, telefoon: item.telefoon, email: item.email, bericht: item.bericht, moment: moment }, function(err, data){
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
            ejs.renderFile(path.resolve(__dirname, '../public/templates/emails/offeremail.ejs'), { voornaam: item.user.voornaam, naam: item.user.naam, email: item.user.username, offerte: item, moment: moment}, function(err, data){
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
          default: //Geen mail versturen.
            console.log("default");
            break;
        }
    });

    //END REGION SENDMAIL

    module.exports = router;

})();
