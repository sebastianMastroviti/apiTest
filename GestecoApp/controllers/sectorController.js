var Client = require('../models/Client');


module.exports = function (router) {

  router.get('/sector', function (req, res) {
    var query = Client.findById(req.query.id);
    query.exec(function (err, client) {
      if (err) console.error(err);
      if (!client)
        res.status(404).json({
          'msj': 'Id de cliente no encontrado: ' + req.query.id
        });
      else
        res.status(200).render('sector', { layout: false, 'client': client });
    });
  });//fin de GET

  router.post('/sector', function (req, res) {
    var _json = JSON.parse(req.body.json);

    var query = Client.findById(_json.client_id);
    query.exec(function (err, client) {
      if (err) console.error(err);
      if (!client)
        res.status(404).json({
          'msj': 'Id de cliente no encontrado: ' + _json.client_id
        });
      else {
        var newSector = {};
        checkProperties(newSector, ['nombre', 'direccion', 'tel', 'email'], _json.sector);
        client.sectores.push(newSector);
        client.save().then(function (myClient) {
          var mySector = myClient.sectores.pop();//pop returns the last element of an array
          res.status(201).json({
            'sector': mySector,
            'msj': 'Info! Sector guardado'
          });
        }, function (e) {
          res.status(400).json({
            'sector': null,
            'msj': 'Debe declarar el campo Nombre.'
          });
        });
      }
    });
  });//fin de POST

  router.put('/sector/:id',  function (req, res) {
    var _json = JSON.parse(req.body.json);

    var query = Client.findById(_json.client_id);
    query.exec(function (err, client) {
      if (err) console.error(err);
      if (!client)
        res.status(404).json({
          'msj': 'Id de cliente no encontrado: ' + _json.client_id
        });
      else {
        var mySector = client.sectores.id(req.params.id);
        if (!mySector)
          return res.status(404).json({
            'msj': 'Id de sector no encontrado: ' + req.params.id
          });

        checkProperties(mySector, ['nombre', 'direccion', 'tel', 'email'], _json.sector);
        client.save().then(function (myClient) {
          if (err) console.error(err);
          res.status(200).json({
            'sector': myClient.sectores.id(req.params.id),
            'msj': 'Info! Sector editado exitosamente.'
          });
        }, function (reason) {
          res.status(500).json({
            'sector': null,
            'msj': 'Error de servidor: ' + reason
          });
        });
      }
    })
  });//fin de PUT

  router.delete('/sector/:id',  function (req, res) {
    var _json = JSON.parse(req.body.json);

    var query = Client.findById(_json.client_id);
    query.exec(function (err, client) {
      if (err) console.error(err);
      if (!client)
        res.status(404).json({
          'msj': 'Id de cliente no encontrado: ' + _json.client_id
        });
      else {
        var mySector = client.sectores.id(req.params.id);
        if (!mySector)
          return res.status(404).json({
            'msj': 'Id de sector no encontrado: ' + req.params.id
          });

        mySector.remove();
        client.save().then(function () {
          res.status(200).json({
            'sector': mySector,
            'msj': 'Info! Sector eliminado.'
          });
        }, function (reason) {
          res.status(500).json({
            'sector': null,
            'msj': 'Error de servidor: ' + reason
          });
        });
      }
    });
  });//fin de DELETE

  return router;
};


function checkProperties(obj, keys, data) {
  keys.forEach(function (key) {
    if (data[key]) obj[key] = data[key];
  });
}