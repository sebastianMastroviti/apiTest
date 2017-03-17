var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creates a schema - this is like a blueprint
var productSchema = new Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  serie: { type: String, required: true },
  tension: Number,
  proveedor: String,
  ubicacion: { type: String, default: 'Santa Rosa 1442' },
  propietario: { type: String, default: 'Gesteco S.A.' },
  enContrato: { type: Boolean, default: false }
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
