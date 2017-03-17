var Client = require('../models/Client');

//comentario 
//segundo comentario: se edita este archivo y el de productos

module.exports = function (router) {

  router.get('/client', function (req, res) {
    var query = Client.find({});
    query.select('_id nombre cuit tel email');

    query.exec(function (err, clients) {
      if (err) console.error(err);
      res.status(200).render('client', { 'clients': clients });
    });
  });//fin de GET

  router.get('/client/:id', function (req, res) {
    var query = Client.findById(req.params.id);
    query.select('_id nombre');

    query.exec(function (err, client) {
      if (err) console.error(err);
      if (!client)
        res.status(404).render('error404',
          { 'msj': 'Id de cliente no encontrado: ' + req.params.id });
      else
        res.status(200).render('profile', { 'client': client });
    });
  });//fin de GET

  router.post('/client', function (req, res) {
    var query = Client.findOne({ 'cuit': req.body.cuit });

    query.exec(function (err, client) {
      if (err) console.error(err);

      if (!client) {
        var newClient = new Client();
        checkProperties(newClient, ['nombre', 'cuit', 'tel', 'email'], req.body);

        newClient.save().then(function (client) {
          res.status(201).json({
            'client': {
              '_id': client._id,
              'nombre': client.nombre,
              'cuit': client.cuit,
              'tel': client.tel,
              'email': client.email
            },
            'msj': 'Info! Cliente guardado.'
          });
        }, function (e) {
          res.status(400).json({
            'client': null,
            'msj': 'Debe declarar los campos Nombre y Cuit.'
          });
        });
      } else {
        res.status(200).json({
          'client': null,
          'msj': 'Info! Este cliente ya existe.'
        });
      }
    });
  });//fin de POST

  router.put('/client', function (req, res) {
    var myClient = req.body;
    var query = Client.findOne({ 'cuit': myClient.cuit });
    query.exec(function (err, oldClient) {
      if (err) console.error(err);
      if (!oldClient)
        res.status(404).json({ 'msj': 'Cliente no encontrado.' });
      else {
        checkProperties(oldClient, ['nombre', 'tel', 'email'], myClient);
        oldClient.save().then(function (client) {
          res.status(200).json({
            'client': {
              '_id': client._id,
              'nombre': client.nombre,
              'cuit': client.cuit,
              'tel': client.tel,
              'email': client.email
            },
            'msj': 'Cliente actualizado correctamente.'
          });
        }, function (reason) {
          res.status(500).json({
            'client': null,
            'msj': 'Error de servidor: ' + reason
          });
        });
      }
    });
  });//fin de PUT

  router.delete('/client/:id', function (req, res) {
    var query = Client.findById(req.params.id);
    query.exec(function (err, client) {
      if (err) console.error(err);
      if (!client)
        res.status(404).render('error404',
          { 'msj': 'Id de cliente no encontrado: ' + req.params.id });
      else {
        client.remove(function (err, oldClient) {
          if (err) console.error(err);
          res.status(200).json(oldClient);
        });
      }
    });
  });// fin de DELETE


  return router;
};


function checkProperties(obj, keys, data) {
  keys.forEach(function (key) {
    if (data[key]) obj[key] = data[key];
  });
}
