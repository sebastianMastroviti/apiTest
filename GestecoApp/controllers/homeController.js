

module.exports = function(router){

  router.get('/home', function(req, res){
    res.render('home');
  });

  return router;
};
