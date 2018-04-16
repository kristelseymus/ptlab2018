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
            sendMail: sendMail, //Helper method
            getRecipient: getRecipient //Helpr method
        };
        return service;

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

        function sendConfirmationOffer(item){//Offer
          var mail = {};
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>";
          mail.subject = "Aanvraag offerte voor datum " + moment(item.startdate).format('LL');
          mail.attachements = "";
          mail.item = item;
          mail.type = "confirmationoffer";

          sendMail(mail);

          console.log("sendConfirmationOffer");
          console.log(item);
        }

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

        function sendCancellationReservation(item){
          var mail = {};
          var user = getRecipient(item.user);
          console.log(user);
          item.user = user;
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>"
          mail.subject = "Annulatie reservatie " + moment(item.startdate).format('LL');
          mail.attachments = "";
          mail.item = item;
          mail.type = "cancellationreservation";

          //sendMail(mail);

          console.log("sendCancellationReservation");
          console.log(item);
        }

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

        function getRecipient(id){
          $http.get('/api/users/' + id, {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function(data) {
            console.log(data);
            return data.data;
          }).error(function(err){
            console.log("Error: " + err);
            return err;
          });
        }

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
