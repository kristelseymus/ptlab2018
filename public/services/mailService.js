(function () {
    'use strict';

    angular.module('ptlab').factory('mailService', mailService);

    mailService.$inject = ['$log', '$http', 'auth'];

    function mailService($log, $http, auth) {
        var service = {
            sendConfirmationReservation: sendConfirmationReservation, //Bevestiging Reservatie
            sendConfirmationQuotation: sendConfirmationQuotation,//Bevestiging Offerte
            sendConfirmationEvent: sendConfirmationEvent, //Bevestiging Event
            sendCancellationEvent: sendCancellationEvent, //Annulatie Event
            sendCancellationReservation: sendCancellationReservation, //Annulatie Reservatie
            sendInvoiceCoworker: sendInvoiceCoworker, //Factuur Co worker
            sendInvoiceManager: sendInvoiceManager, //Factuur Manager
            sendMail: sendMail //Helper method
        };
        return service;

        function sendConfirmationReservation(item){
          console.log(item);
          //Minified HTML
          var html = '<!doctype html><html><head><meta name="viewport" content="width=device-width" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Simple Transactional Email</title><style>img{border:none;-ms-interpolation-mode:bicubic;max-width:100%}body{background-color:#f6f6f6;font-family:sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%}table td{font-family:sans-serif;font-size:14px;vertical-align:top}.body{background-color:#f6f6f6;width:100%}.container{display:block;Margin:0 auto !important;max-width:580px;padding:10px;width:580px}.content{box-sizing:border-box;display:block;Margin:0 auto;max-width:580px;padding:10px}.main{background:#fff;border-radius:3px;width:100%}.wrapper{box-sizing:border-box;padding:20px}.content-block{padding-bottom:10px;padding-top:10px}.footer{clear:both;Margin-top:10px;text-align:center;width:100%}.footer td, .footer p, .footer span, .footer a{color:#999;font-size:12px;text-align:center}h1,h2,h3,h4{color:#000;font-family:sans-serif;font-weight:400;line-height:1.4;margin:0;Margin-bottom:30px}h1{font-size:35px;font-weight:300;text-align:center;text-transform:capitalize}p,ul,ol{font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;Margin-bottom:15px}p li, ul li, ol li{list-style-position:inside;margin-left:5px}a{color:#3498db;text-decoration:underline}.btn{box-sizing:border-box;width:100%}.btn>tbody>tr>td{padding-bottom:15px}.btn table{width:auto}.btn table td{background-color:#fff;border-radius:5px;text-align:center}.btn a{background-color:#fff;border:solid 1px #3498db;border-radius:5px;box-sizing:border-box;color:#3498db;cursor:pointer;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:12px 25px;text-decoration:none;text-transform:capitalize}.btn-primary table td{background-color:#3498db}.btn-primary a{background-color:#3498db;border-color:#3498db;color:#fff}.last{margin-bottom:0}.first{margin-top:0}.align-center{text-align:center}.align-right{text-align:right}.align-left{text-align:left}.clear{clear:both}.mt0{margin-top:0}.mb0{margin-bottom:0}.preheader{color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0}.powered-by a{text-decoration:none}hr{border:0;border-bottom:1px solid #f6f6f6;Margin:20px 0}@media only screen and (max-width: 620px){table[class=body] h1{font-size:28px !important;margin-bottom:10px !important}table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a{font-size:16px !important}table[class=body] .wrapper, table[class=body] .article{padding:10px !important}table[class=body] .content{padding:0 !important}table[class=body] .container{padding:0 !important;width:100% !important}table[class=body] .main{border-left-width:0 !important;border-radius:0 !important;border-right-width:0 !important}table[class=body] .btn table{width:100% !important}table[class=body] .btn a{width:100% !important}table[class=body] .img-responsive{height:auto !important;max-width:100% !important;width:auto !important}}@media all{.ExternalClass{width:100%}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height:100%}.apple-link a{color:inherit !important;font-family:inherit !important;font-size:inherit !important;font-weight:inherit !important;line-height:inherit !important;text-decoration:none !important}.btn-primary table td:hover{background-color:#34495e !important}.btn-primary a:hover{background-color:#34495e !important;border-color:#34495e !important}}</style></head><body class=""><table border="0" cellpadding="0" cellspacing="0" class="body"><tr><td>&nbsp;</td><td class="container"><div class="content"><table class="main"><tr><td class="wrapper"><table border="0" cellpadding="0" cellspacing="0"><tr><td><p>Hallo {{voornaam}},</p><p>Hierbij bevestigen we jouw reservatie bij Planet Talent op {{startdate | date:"dd MMMM yyyy"}} {{keuzeDag != "volledigedag" ? "in de {{keuzeDag}}" : "voor een volledige dag"}}. Je hebt een plaatsje gekregen in het Co working Lab</p><p>Praktische informatie:</p><ul><li><b>Wanneer?</b> {{startdate | date:"dd MMMM yyyy"}} {{keuzeDag != "volledigedag" ? "in de {{keuzeDag}}" : "voor een volledige dag"}}.</li><li><b>Waar?</b> Co-working Lab</li><li><b>Adres?</b> Planet Talent, Frank van Dyckelaan 7b, 9140 Temse</li></ul><p>Je mag bij aankomst aanbellen en jouw naam vernoemen.</p><p>Wij kijken er naar uit om jou te mogen ontvangen.</p><p>Bedankt voor de reservatie! Tot dan.</p></td></tr></table></td></tr></table><div class="footer"><table border="0" cellpadding="0" cellspacing="0"><tr><td class="content-block"> <span class="apple-link">Planet Talent <br>Frank van Dyckelaan 7b<br> 9140 Temse</span> <br><br> Vragen?<br> Geef een seintje op +32 3 226 48 28 of stuur ons een <a href="mailto:test@test.be?Subject=Vraag%20voor%20Planet%20Talent" target="_top">mailtje</a>.</td></tr></table></div></div></td><td>&nbsp;</td></tr></table></body></html>';

          var mail = {};
          mail.html = html;
          mail.to = item.user.username;
          mail.from = "Planet Talent <test@test.be>";
          mail.subject = "Reservatie op {{item.startdate | date: 'dd MMMM yyyy'}}";
          mail.attachements = "";
          mail.item = item;

          sendMail(mail);



          console.log("sendConfirmationReservation");
          console.log(item);
        }

        function sendConfirmationQuotation(item){
          console.log("sendConfirmationQuotation");
          console.log(item);
        }

        function sendConfirmationEvent(item){
          console.log("sendConfirmationEvent");
          console.log(item);
        }

        function sendCancellationEvent(item){
          console.log("sendCancellationEvent");
          console.log(item);
        }

        function sendCancellationReservation(item){
          console.log("sendCancellationReservation");
          console.log(item);
        }

        function sendInvoiceCoworker(item){
          console.log("sendInvoiceCoworker");
          console.log(item);
        }

        function sendInvoiceManager(item){
          console.log("sendInvoiceManager");
          console.log(item);
        }

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
