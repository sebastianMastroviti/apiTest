var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sectorSchema = new Schema({
  nombre: { type: String, required: true },
  direccion: String,
  tel: { type: Number, default: 0 },
  email: { type: String, default: 'No email' }
});

//creates a schema - this is like a blueprint
var clientSchema = new Schema({
  nombre: { type: String, required: true },
  cuit: { type: Number, required: true },
  sectores: [sectorSchema],
  contratos: [{ type: Schema.Types.ObjectId, ref: 'Contract' }],
  tel: { type: Number, default: 0 },
  email: { type: String, default: 'No email' }
});

var Client = mongoose.model('Client', clientSchema);

module.exports = Client;
