var mongoose = require('mongoose');

var BlockedDatesSchema = new mongoose.Schema({
    blockeddates: [Date],
    year: Number
});

mongoose.model('BlockedDates', BlockedDatesSchema);
