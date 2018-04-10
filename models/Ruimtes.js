var mongoose = require('mongoose');

var RuimteSchema = new mongoose.Schema({
    name: String,
    aantalPlaatsen: Number,
    beschrijving: String
});

mongoose.model('Ruimte', RuimteSchema);
