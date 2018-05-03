var mongoose = require('mongoose');

var RuimteSchema = new mongoose.Schema({
    name: String,
    aantalPlaatsen: Number,
    beschrijving: String,
    price: Number,
    priceperperson: Number,
    elektriciteitsaansluitingen: Number,
    internetavailable: Boolean,
    coffeewateravailable: Boolean,
    printeravailable: Boolean,
    imagelink: String
});

mongoose.model('Ruimte', RuimteSchema);
