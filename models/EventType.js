var mongoose = require('mongoose');

var EventTypeSchema = new mongoose.Schema({
    name: String,
    idnumber: Number
});

mongoose.model('EventType', EventTypeSchema);

/*
EventType kan maar 1 van de 2 mogelijke waarden bevatten.
Een event kan van het type
  - Evenement of
  - Training
zijn.
*/
