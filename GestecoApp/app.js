const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const router = express.Router();
const mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;

const homeController = require('./controllers/homeController');
const clientController = require('./controllers/clientController');
const sectorController = require('./controllers/sectorController');
const contractController = require('./controllers/contractController');
const serviceController = require('./controllers/serviceController');
const productController = require('./controllers/productController');

const app = express();

//set up template engine
app.set('view engine', 'ejs');

//Gzip compressing can greatly decrease the size
//of the response body and hence increase the speed of a web app
app.use(compression());

//static files
app.use(express.static('./public'));

// Add headers
app.use(function (req, res, next) {

  res.set({
    // Website you wish to allow to connect
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    'Access-Control-Allow-Credentials': true,
    // Request headers you wish to allow
    'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
    // Request methods you wish to allow
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  });

  next();
});

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//conxion con la base de datos test
const dbURI = 'mongodb://127.0.0.1/test';
connectToDB(mongoose, dbURI);

app.use('/', homeController(router));
app.use('/', clientController(router));
app.use('/', contractController(router));
app.use('/product', productController(router));
app.use('/', sectorController(router));
app.use('/', serviceController(router));

app.use(function (err, req, res, next) {//error handler middleware
  res.status(err.status || 500);
  res.json({
    'message': err.message,
    'error': err
  });
});


app.set('port', process.env.PORT || 3000);//http://stackoverflow.com/questions/18864677/what-is-process-env-port-in-node-js
app.listen(app.get('port'), function () {
  console.log('you are listening on port ' + app.get('port'));
});


function connectToDB(mongoose, dbURI) {

  mongoose.connect(dbURI)
    .then(() => console.log('Mongoose default connection open to ' + dbURI))
    .catch(err => console.log('Mongoose default connection error: ' + err));
  //CONNECTION EVENTS

  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });

}