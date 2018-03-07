var mongoose = require('mongoose');

var RuimteSchema = new mongoose.Schema({
    name: String,
    aantalPlaatsen: Number
});

mongoose.model('Ruimte', RuimteSchema);
