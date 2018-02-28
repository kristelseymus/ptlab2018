(function () {

    'use strict';

    var mongoose = require('mongoose');
    var express = require('express');

    var router = express.Router();

    var User = mongoose.model('User');
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


    module.exports = router;

})();
