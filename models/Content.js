var mongoose = require('mongoose');

var ContentSchema = new mongoose.Schema({
    home: String,
    voorwiemanager: String,
    voorwiecoworker: String,
    voorwiestudent: String,
    imagevoorwie: String,
    practicals: String,
    openingsuren: [{day: String, openingsuur: Number, sluitingsuur: Number}],
    adres: {naam: String, straat: String, nummer: String, postcode:String, stad: String, telefoon: String}
});

mongoose.model('Content', ContentSchema);
