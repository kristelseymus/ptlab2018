var mongoose = require('mongoose');

var ReservatieSchema = new mongoose.Schema({
    name: String,
    startdate: Date,
    duration: Number,
    paid: Boolean,
    ruimte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ruimte'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reservatieType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReservatieType'
    }
});

mongoose.model('Reservatie', ReservatieSchema);
