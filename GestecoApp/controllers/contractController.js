var Product = require('../models/Product');
var Contract = require('../models/Contract');
var Client = require('../models/Client');
var fn = require('../UsefulFunctions/functions');

module.exports = function (router) {

  router.get('/contract', function (req, res) {

    var clientCallback = function (err, client, products) {
      if (err) console.error(err);
      if (!client)
        return res.status(404).render(
          'error404', {
            'msj': 'Id de cliente no encontrado: ' + req.query.id
          });

      res.status(200).render('contract', {
        'layout': false,
        'products': products,
        'contracts': client.contratos,
        'sectors': client.sectores
      });
    };

    var productsCallback = function (err, products) {
      if (err) console.error(err);
      var query = Client.findById(req.query.id);
      query.populate('contratos');
      query.exec(function (err, client) {
        clientCallback(err, client, products);
      });
    };

    var query = Product.find({ 'enContrato': false });
    query.exec(productsCallback);
  });//fin de GET

  router.get('/contract/:id', function (req, res) {

    var contractCallback = function (err, contract) {
      if (err) console.error(err);
      if (!contract)
        return res.status(404).render(
          'error404', {
            'msj': 'Id de contrato no encontrado: ' + req.params.id
          });

      res.status(200).json({
        'detalles': (contract.detalles.length > 0) ? contract.detalles : []
      });
    };

    var query = Contract.findById(req.params.id);
    query.populate('detalles._idEquipo');
    query.exec(contractCallback);
  });//fin de GET/:id


  router.post('/contract', function (req, res) {

    const _json = req.body.json;

      var clientCallback = (err, client, contract) => {
        if (err) console.error(err);
        if (!client)
          return res.status(404).render(
            'error404', {
              'msj': 'Id de cliente no encontrado: ' + _json.client_id
            });
        client.contratos.push(contract._id);
        client.save()
          .then(function () {
            _json.contract.detalles.forEach(function (detail) {
              updateProduct(detail, true);
            });
            res.status(200).json(contract);
          })
          .catch(function (reason) {
            res.status(500).json({
              'msj': 'Error de servidor. ' + reason
            });
          });
      };

      var saveContractCallback = contract => {
        var query = Client.findById(_json.client_id);
        query.exec(function (err, client) {
          clientCallback(err, client, contract);
        });
      };

      var newContract = new Contract();
      _json.contract.detalles.forEach(function (detalle) {
        var myDetail = {};
        fn.checkProperties(myDetail, ['_idEquipo', 'volumenFijo', 'cargoFijo', 'costoExcedente'], detalle);
        newContract.detalles.push(myDetail);
      });
      fn.checkProperties(newContract, ['tipoContrato', 'inicio', 'fin'], _json.contract);

      newContract.save()
        .then(saveContractCallback)
        .catch(function (reason) {
          res.json({
            'msj': 'SOMETHING WENT WRONG.REASON: ' + reason
          });
        });


  });//fin de POST

  router.delete('/contract/:id/detail',  function (req, res) {

    fn.parseJSON(req.body.json).then(_json => {

      var contractCallback = (err, contract) => {
        if (err) console.error(err);
        var detail;
        _json.detail_ids.forEach(function (detail_id) {
          detail = contract.detalles.id(detail_id);
          detail.remove()
            .then(function () {
              updateProduct(detail, false);
            })
            .catch(function (reason) {
              return res.status(500).json({
                'msj': 'Error de servidor' + reason
              });
            });
        });
        res.status(200).json(_json.detail_ids);
      };

      var query = Contract.findById(req.params.id);
      query.exec(contractCallback);
    }).catch(console.error);
  });// fin de DELETE/:id/detail

  router.put('/contract/:id',  function (req, res) {

    fn.parseJSON(req.body.json).then(_json => {

      var contractCallback = (err, contract) => {
        if (err) console.error(err);
        fn.checkProperties(contract, ['tipoContrato', 'inicio', 'fin'], _json.contract);

        var detalle;
        _json.contract.detalles.forEach(function (myDetail) {
          detalle = contract.detalles.id(myDetail._id);//detail-id
          fn.checkProperties(detalle, ['volumenFijo', 'cargoFijo', 'costoExcedente'], myDetail);
        });

        contract.save()
          .then(function () {
            res.status(201).json({
              'msj': 'Contrato editado exitosamente.'
            });
          })
          .catch(function (reason) {
            res.status(500).json({
              'msj': 'Error de servidor. ' + reason
            });
          });
      };

      var query = Contract.findById(req.params.id);
      query.exec(contractCallback);
    }).catch(console.error);
  });//fin de PUT/:id


  router.delete('/contract/:id',  function (req, res) {

    fn.parseJSON(req.body.json).then(_json => {
      var contract_id = req.params.id;

      var contractCallback =  (err, contract)=> {
        if (err) console.error(err);
        contract.remove()
          .then(function (contract) {
            contract.detalles.forEach(function (detail) {
              updateProduct(detail, false);
            });
            res.status(200).json(contract._id);
          })
          .catch(function (reason) {
            res.status(500).json({
              'msj': 'Error de servidor' + reason
            });
          });
      };

      var saveClientCallback = ()=> {
        var query = Contract.findById(contract_id);
        query.exec(contractCallback);
      };

      var clientCallback =  (err, client)=> {
        if (err) console.error(err);
        client.contratos.pull(contract_id);
        client.save()
          .then(saveClientCallback)
          .catch(function (reason) {
            res.status(500).json({
              'msj': 'Error de servidor' + reason
            });
          });
      };

      var query = Client.findById(_json.client_id);
      query.exec(clientCallback);
    }).catch(console.error);
  });//fin de DELETE/:id

  return router;
};//fin de module.exports

function updateProduct(detail, enContrato) {//actualizo boolean enContrato a true
  Product.findById(detail._idEquipo, function (err, product) {
    if (err) console.error(err);
    product.enContrato = enContrato;
    product.save();
    console.log('products updated successfully!');
  });
}
