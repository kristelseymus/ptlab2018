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
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Reservatie op " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "confirmationreservation"
          };

          sendMail(mail);

          console.log("sendConfirmationReservation");
          console.log(item);
        }

        /* Send a confirmation e-mail for an offer */
        function sendConfirmationOffer(item){
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Aanvraag offerte voor " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "confirmationoffer"
          };

          sendMail(mail);

          console.log("sendConfirmationOffer");
          console.log(item);
        }

        /* Send a confirmation e-mail for an event */
        function sendConfirmationEvent(item){
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Evenement op " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "confirmationevent"
          };

          sendMail(mail);

          console.log("sendConfirmationEvent");
          console.log(item);
        }

        /* Send an e-mail to notify the manager that the event is canceled */
        function sendCancellationEvent(item){
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.be>",
            subject: "Annulatie evenement " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "cancellationevent"
          };

          sendMail(mail);

          console.log("sendCancellationEvent");
          console.log(item);
        }

        /* Send an e-mail to a user to notify him/her that his/her reservation is cancelled */
        function sendCancellationReservation(item){
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Annulatie reservatie " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "cancellationreservation"
          };

          sendMail(mail);

          console.log("sendCancellationReservation");
          console.log(item);
        }

        /* Send an invoice to a coworker */
        function sendInvoiceCoworker(item){
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Factuur reservatie " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "invoicecoworker",
            factuurnummer: "" + item.startdate.getFullYear() + "-" + item.startdate.getMonth() + "/R" + reservatieService.getReservatiesByDay(item.startdate).length
          };

          sendMail(mail);

          console.log("sendInvoiceCoworker");
          console.log(item);
        }

        /* Send an invoice to a manager */
        function sendInvoiceManager(item){
          console.log(item);
          var mail = {
            to: item.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Factuur " + item.name + " " + moment(item.startdate).format('LL'),
            attachments: "",
            item: item,
            type: "invoicemanager",
            factuurnummer: "" + item.startdate.getFullYear() + "-" + item.startdate.getMonth() + "/E" + eventService.getEventsByDay(item.startdate).length
          };

          sendMail(mail);

          console.log("sendInvoiceManager");
          console.log(item);
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

          console.log("sendContactMail");
          console.log(contact);
        }

        /* Send an e-mail to Planet Talent to notify them that an offer has been made */
        function sendOfferMail(item){
          var mail = {
            to: "Planet Talent <contact@planer-talent.com>",
            from: item.offerte.user.username,
            subject: item.subject,
            attachments: "",
            item: item.offerte,
            type: "offermail"
          };

          sendMail(mail);

          console.log("sendOfferMail");
          console.log(item.offerte);
        }

        /* Send an e-mail that the offer is being handled.
        This e-mail is sent when there are reservations in the same room at the same time. */
        function sendAwaitingOfferMail(offerte) {
          var mail = {
            to: offerte.user.username,
            from: "Planet Talent <contact@planet-talent.com>",
            subject: "Offerte in afwachting",
            attachments: "",
            item: offerte,
            type: "awaitingoffer"
          };

          sendMail(mail);

          console.log("sendAwaitingOfferMail");
          console.log(offerte);
        }

        /* API request to send the given e-mail */
        function sendMail(mail){
          return $http.post('/api/sendmail', mail, {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function (res){
            console.log(res);
            return res;
          }).error(function (err){
            console.log(err);
            return err;
          });
        }
    }
})();
