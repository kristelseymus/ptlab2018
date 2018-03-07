var mongoose = require('mongoose');

var ReservatieTypeSchema = new mongoose.Schema({
    name: String
});

mongoose.model('ReservatieType', ReservatieTypeSchema);

/*
ReservatieType kan maar 1 van de 3 mogelijke waarden bevatten.
Een reservatie kan van het type
  - StudentReservatie,
  - CoworkerReservatie of
  - ManagerReservatie (Hier valt ook een trainer onder)
zijn.
*/
