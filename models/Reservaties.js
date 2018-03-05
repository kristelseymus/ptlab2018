var mongoose = require('mongoose');

var ReservatieSchema = new mongoose.Schema({
    name: String
});

mongoose.model('Reservatie', ReservatieSchema);
