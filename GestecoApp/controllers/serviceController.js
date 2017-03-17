var Client = require('../models/Client');
var Product = require('../models/Product');

module.exports = function(router){

  router.get('/service', function(req, res){
    var myId = req.query.id;
    Client.findById(myId, function(err, clientDoc){
      if(err || !clientDoc) throw err;
      var contratosVigente = [];
      var _equipos = [];
      clientDoc.contratos.forEach(function(contrato, index1){
        if(contrato && contrato.fin > new Date()){
          contratosVigente.push(contrato);

          contrato.equipos.forEach(function(eq, index2){
            Product.findById(eq.equipo, function(err, productDoc){
              if(err || !productDoc) throw err;
              _equipos.push(productDoc);
              if(clientDoc.contratos.length == index1 + 1 && contrato.equipos.length == index2 + 1){
                clientDoc.contratos = contratosVigente;
                res.render('service', {layout: false, client: clientDoc, equipos: _equipos});
              }
            });
          });
        }
      });
    });
  });


  return router;
};
