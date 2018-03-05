var mongoose = require('mongoose');

var RuimteSchema = new mongoose.Schema({
    name: String,
    totalPlaces: Number
});

mongoose.model('Ruimte', RuimteSchema);
