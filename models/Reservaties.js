var mongoose = require('mongoose');

var ReservatieSchema = new mongoose.Schema({
    name: String,
    startdate: Date,
    paid: Boolean,
    keuzeDag: String,
    ruimte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ruimte'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
});

mongoose.model('Reservatie', ReservatieSchema);
