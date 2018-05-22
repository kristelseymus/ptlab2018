(function () {
    'use strict';

    angular.module('ptlab').factory('mailService', mailService);

    mailService.$inject = ['$log', '$http', 'auth', 'reservatieService', 'eventService'];

    function mailService($log, $http, auth, reservatieService, eventService) {
        var service = {
            sendConfirmationReservation: sendConfirmationReservation, //Bevestiging Reservatie
            sendConfirmationOffer: sendConfirmationOffer,//Bevestiging Offerte
            sendConfirmationEvent: sendConfirmationEvent, //Bevestiging Event
            sendCancellationEvent: sendCancellationEvent, //Annulatie Event
            sendCancellationReservation: sendCancellationReservation, //Annulatie Reservatie
            sendInvoiceCoworker: sendInvoiceCoworker, //Factuur Co worker
            sendInvoiceManager: sendInvoiceManager, //Factuur Manager
            sendContactMail: sendContactMail, //Contact formulier doorsturen naar Planet Talent.
            sendOfferMail: sendOfferMail, //Doorsturen van een offerte naar Planet Talent.
            sendAwaitingOfferMail: sendAwaitingOfferMail, //Offerte in afwachting
            sendMail: sendMail //Helper method
        };
        return service;

        /* Send a confirmation e-mail for a reservation */
        function sendConfirmationReservation(item){
          item.datedmy = moment(item.startdate).format('LL');
          item.dated = moment(item.startdate).format('dddd');
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Reservatie op " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "confirmationreservation"
          };

          sendMail(mail);
        }

        /* Send a confirmation e-mail for an offer */
        function sendConfirmationOffer(item){
          item.datedmy = moment(item.startdate).format( 'LL' );
          item.van = moment(item.startdate).format( 'LT' );
          item.tot = moment(item.startdate).add(item.duur, 'minutes').format( 'LT' );
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Aanvraag offerte voor " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "confirmationoffer"
          };

          sendMail(mail);
        }

        /* Send a confirmation e-mail for an event */
        function sendConfirmationEvent(item){
          item.datedmy = moment(item.startdate).format( 'LL' );
          item.van = moment(item.startdate).format( 'LT' );
          item.tot = moment(item.startdate).add(item.duur, 'minutes').format( 'LT' );
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Evenement op " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "confirmationevent"
          };

          sendMail(mail);
        }

        /* Send an e-mail to notify the manager that the event is canceled */
        function sendCancellationEvent(item){
          item.datedmy = moment(item.startdate).format( 'LL' );
          item.van = moment(item.startdate).format( 'LT' );
          item.tot = moment(item.startdate).add(item.duur, 'minutes').format( 'LT' );
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.be>",
            subject: "Annulatie evenement " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "cancellationevent"
          };

          sendMail(mail);
        }

        /* Send an e-mail to a user to notify him/her that his/her reservation is cancelled */
        function sendCancellationReservation(item){
          item.datedmy = moment(item.startdate).format( 'LL' );
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Annulatie reservatie " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "cancellationreservation"
          };

          sendMail(mail);
        }

        /* Send an invoice to a coworker */
        function sendInvoiceCoworker(item){
          item.factuurdatum = moment().format('LL');
          item.vervaldatum = moment().add(1, 'M').format('LL');
          item.datedmy = moment(item.startdate).format( 'LL' );
          if(item.keuzeDag == "volledigedag"){
            item.price = item.ruimte.price*2;
          } else {
            item.price = item.ruimte.price;
          }

          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Factuur reservatie " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "invoicecoworker"
          };

          sendMail(mail);
        }

        /* Send an invoice to a manager */
        function sendInvoiceManager(item){
          item.factuurdatum = moment().format('LL');
          item.vervaldatum = moment().add(1, 'M').format('LL');
          item.datedmy = moment(item.startdate).format( 'LL' );
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Factuur " + item.name + " " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "invoicemanager"
          };

          sendMail(mail);
        }

        /* Send the contact form to Planet Talent */
        function sendContactMail(contact){
          var mail = {
            to: "Planet Talent <contact@planet-talent.com>",
            from: contact.email,
            subject: "Vraag voor Planet Talent",
            attachments: "",
            item: contact,
            type: "contactmail"
          };

          sendMail(mail);
        }

        /* Send an e-mail to Planet Talent to notify them that an offer has been made */
        function sendOfferMail(item){
          item.datedmy = moment(item.offerte.startdate).format( 'LL' );
          item.van = moment(item.offerte.startdate).format( 'LT' );
          item.tot = moment(item.offerte.startdate).add(item.offerte.duur, 'minutes').format( 'LT' );
          var mail = {
            to: "Planet Talent <contact@planer-talent.com>",
            from: item.offerte.user.username,
            subject: item.subject,
            attachments: "",
            item: item,
            type: "offermail"
          };

          sendMail(mail);
        }

        /* Send an e-mail that the offer is being handled.
        This e-mail is sent when there are reservations in the same room at the same time. */
        function sendAwaitingOfferMail(offerte) {
          offerte.datedmy = moment(offerte.startdate).format( 'LL' );
          offerte.van = moment(offerte.startdate).format( 'LT' );
          offerte.tot = moment(offerte.startdate).add(offerte.duur, 'minutes').format( 'LT' );
          var mail = {
            to: offerte.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Offerte in afwachting",
            attachments: "",
            item: offerte,
            type: "awaitingoffer"
          };

          sendMail(mail);
        }

        /* API request to send the given e-mail */
        function sendMail(mail){
          return $http.post('/api/sendmail', mail, {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function (res){
            return res;
          }).error(function (err){
            return err;
          });
        }
    }
})();
