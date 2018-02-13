"use strict";
var express = require('express');
var configurations = module.exports;
var app = express();
var nconf = require('nconf');
var redis = require('redis');
var db = redis.createClient();
var settings = require('./settings')(app, configurations, express);

db.select(settings.set('napkin'), function(errDb, res) {
  console.log('PROD/DEV database connection status: ', res);
});

nconf.argv().env().file({ file: 'local.json' });

// routes
require('./routes')(app, nconf, db);
require('./routes/auth')(app, nconf, db);
// last handler; assume 404 at this point
var utils = require('./lib/utils');
app.use(utils.render404);


app.listen(process.env.PORT || nconf.get('port'));
