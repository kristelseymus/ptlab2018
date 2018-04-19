(function () {
    'use strict';

    angular.module('ptlab').factory('mailService', mailService);

    mailService.$inject = ['$log', '$http', 'auth'];

    function mailService($log, $http, auth) {
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
            sendMail: sendMail //Helper method
        };
        return service;

        /* Send a confirmation e-mail for a reservation */
        function sendConfirmationReservation(item){
          var mail = {};
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>";
          mail.subject = "Reservatie op " + moment(item.startdate).format('LL');
          mail.attachements = "";
          mail.item = item;
          mail.type = "confirmationreservation";

          sendMail(mail);

          console.log("sendConfirmationReservation");
          console.log(item);
        }

        /* Send a confirmation e-mail for an offer */
        function sendConfirmationOffer(item){
          var mail = {};
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>";
          mail.subject = "Aanvraag offerte voor " + moment(item.startdate).format('LL');
          mail.attachements = "";
          mail.item = item;
          mail.type = "confirmationoffer";

          sendMail(mail);

          console.log("sendConfirmationOffer");
          console.log(item);
        }

        /* Send a confirmation e-mail for an event */
        function sendConfirmationEvent(item){
          var mail = {};
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>";
          mail.subject = "Evenement op " + moment(item.startdate).format('LL');
          mail.attachements = "";
          mail.item = item;
          mail.type = "confirmationevent";

          sendMail(mail);

          console.log("sendConfirmationEvent");
          console.log(item);
        }

        /* Send an e-mail to notify the manager that the event is canceled */
        function sendCancellationEvent(item){
          var mail = {};
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>";
          mail.subject = "Annulering evenement " + moment(item.startdate).format('LL');
          mail.attachments = "";
          mail.item = item;
          mail.type = "cancellationevent";

          sendMail(mail);

          console.log("sendCancellationEvent");
          console.log(item);
        }

        /* Send an e-mail to a user to notify him/her that his/her reservation is cancelled */
        function sendCancellationReservation(item){
          var mail = {};
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>"
          mail.subject = "Annulatie reservatie " + moment(item.startdate).format('LL');
          mail.attachments = "";
          mail.item = item;
          mail.type = "cancellationreservation";

          sendMail(mail);

          console.log("sendCancellationReservation");
          console.log(item);
        }

        /* Send an invoice to a coworker */
        function sendInvoiceCoworker(item){
          var mail = {};
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>";
          mail.subject = "Factuur reservatie " + moment(item.startdate).format('LL');
          mail.attachments = "";
          mail.item = item;
          mail.type = "invoicecoworker";
          mail.factuurnummer = "" + item.startdate.getFullYear() + "-" + item.startdate.getMonth() + "/0002";

          sendMail(mail);

          console.log("sendInvoiceCoworker");
          console.log(item);
        }

        /* Send an invoice to a manager */
        function sendInvoiceManager(item){
          var mail = {};
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>";
          mail.subject = "Factuur evenement " + moment(item.startdate).format('LL');
          mail.attachments = "";
          mail.item = item;
          mail.type = "invoicemanager";

          sendMail(mail);

          console.log("sendInvoiceManager");
          console.log(item);
        }

        /* Send the contact form to Planet Talent */
        function sendContactMail(contact){
          var mail = {};
          mail.to = "Planet Talent <contact@planet-talent.be>";
          mail.from = contact.email;
          mail.subject = "Vraag voor Planet Talent";
          mail.attachments = "";
          mail.item = contact;
          mail.type = "contactmail";

          sendMail(mail);

          console.log("sendContactMail");
          console.log(contact);
        }

        /* Send an e-mail to Planet Talent to notify them that an offer has been made */
        function sendOfferMail(offerte){
          var mail = {};
          mail.to = "Planet Talent <contact@planet-talent.be>";
          mail.from = offerte.user.username;
          mail.subject = "Offerte " + offerte.ruimte.name + " " + moment(offerte.startdate).format('LL');
          mail.attachments = "";
          mail.item = offerte;
          mail.type = "offermail";

          sendMail(mail);

          console.log("sendOfferMail");
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
