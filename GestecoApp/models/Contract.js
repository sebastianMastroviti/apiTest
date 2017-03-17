var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contractDetailSchema = new Schema({
  _idEquipo: { type: Schema.Types.ObjectId, ref: 'Product' },
  volumenFijo: { type: Number, default: 0 },
  cargoFijo: { type: Number, default: 0 },
  costoExcedente: { type: Number, default: 0 }
});

var contractSchema = new Schema({
  tipoContrato: String,
  inicio: Date,
  fin: Date,
  detalles: [contractDetailSchema]//antes detalles era equipos
});

var Contract = mongoose.model('Contract', contractSchema);
module.exports = Contract;
