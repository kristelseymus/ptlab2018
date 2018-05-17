var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    name: String,
    description: String,
    startdate: Date,
    keuzeDag: String,
    publiek: Boolean,
    catering: Boolean,
    duur: Number,
    factuurnummer: String,
    ruimte: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ruimte'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    eventType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventType'
    }
});

mongoose.model('Event', EventSchema);
