/**
 * Module dependencies.
 */
const express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  path = require('path');

const app = express();

// all environments
app.set('port', process.env.PORT || 8085);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// development only
if ('development' === app.get('env')) {
  app.use(errorHandler());
}

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
