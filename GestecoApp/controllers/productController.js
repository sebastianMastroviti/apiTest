var Product = require('../models/Product');
var fn = require('../UsefulFunctions/functions');


module.exports = function (router) {

  router.get('/', function (req, res, next) {
    const productsCallback = (err, products) => {
      if (err) return next(err);
      res.status(200).json({ 'products': products });
    };
    const query = Product.find({});
    query.exec()
      .then(productsCallback)
      .catch(next);
  });//fin de GET

  router.post('/', function (req, res, next) {
    const _product = req.body;// {} if an error occurred

    var saveProductCallback = product => {
      res.status(201).json({
        'product': product,
        'msj': 'Producto guardado exitosamente.'
      });
    };

    var productCallback = (err, product) => {
      if (err) return next(err);
      if (!product) {
        var newProduct = new Product();
        fn.checkProperties(newProduct, ['marca', 'modelo', 'serie', 'tension', 'proveedor'], _product);
        newProduct.save()
          .then(saveProductCallback)
          .catch(reason => {
            res.status(400).json({
              'product': null,
              'msj': 'Debe declarar los campos Marca, Modelo y Serie.'
            })
          });
      } else {
        res.status(200).json({
          'msj': 'Info! Este producto ya existe.'
        });
      }
    };

    var query = Product.findOne({
      $and: [
        { 'marca': _product.marca },
        { 'modelo': _product.modelo },
        { 'serie': _product.serie }]
    });
    query.exec(productCallback);
  });//fin de POST

  router.put('/:id', function (req, res, next) {
    var query = Product.findById(req.params.id);
    query.exec(function (err, product) {
      if (err) return next(err);
      if (!product)
        return res.status(404).render(
          'error404', {
            'msj': 'Id de producto no encontrado: ' + req.params.id
          });

      fn.checkProperties(product, ['marca', 'modelo', 'serie', 'tension', 'proveedor'], req.body)
      product.save().then(function (myProduct) {
        res.status(200).json({
          'product': myProduct,
          'msj': 'Info! Producto editado exitosamente!'
        });
      }).catch(function (reason) {
        res.status(500).json({
          'product': null,
          'msj': 'Error de servidor: ' + reason
        });
      });
    });
  });//fin de PUT

  router.delete('/:id', function (req, res, next) {
    var query = Product.findById(req.params.id);
    query.exec(function (err, product) {
      if (err) return next(err);
      if (!product)
        return res.status(404).render(
          'error404', {
            'msj': 'Id de producto no encontrado: ' + req.params.id
          });

      if (!product.enContrato) {
        product.remove().then(function (myProduct) {
          res.status(200).json({
            'product': myProduct,
            'msj': 'Info! Producto eliminado.'
          });
        }).catch(function (reason) {
          res.status(500).json({
            'product': null,
            'msj': 'Error de servidor' + reason
          });
        });
      } else
        res.status(200).json({ 'msj': 'Info! Equipo aun en contrato.' });
    });
  });//fin de DELETE


  return router;
}

