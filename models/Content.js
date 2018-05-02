var mongoose = require('mongoose');

var ContentSchema = new mongoose.Schema({
    home: String,
    voorwiemanager: String,
    voorwiecoworker: String,
    voorwiestudent: String,
    prijzen: String,
    practicals: String,
    

});

mongoose.model('Content', ContentSchema);
