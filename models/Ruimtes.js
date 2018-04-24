var mongoose = require('mongoose');

var RuimteSchema = new mongoose.Schema({
    name: String,
    aantalPlaatsen: Number,
    beschrijving: String,
    price: Number,
    priceperperson: Number,
    internetavailable: Boolean,
    coffeewateravailable: Boolean,
    printeravailable: Boolean 
});

mongoose.model('Ruimte', RuimteSchema);
