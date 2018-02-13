// Module dependencies.
module.exports = function(app, configurations, express) {
  var clientSessions = require('client-sessions');
  var nconf = require('nconf');
  var stylus = require('stylus');
  var bodyParser = require('body-parser');
  var methodOverride = require('method-override');
  var errorHandler = require('errorhandler');
  
  nconf.argv().env().file({ file: 'local.json' });

  // Configuration

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(bodyParser());
  app.use(methodOverride());

  app.use(clientSessions({
    cookieName: nconf.get('session_cookie'),
    secret: nconf.get('session_secret'), // MUST be set
    // true session duration:
    // will expire after duration (ms)
    // from last session.reset() or
    // initial cookieing.
    duration: 24 * 60 * 60 * 1000 * 28 // 4 weeks
  }));

  app.use(stylus.middleware({
    src: __dirname + '/public',
    dest: __dirname + '/public',
    compile: function(str, path, fn) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .set('warn', true);
    }
  }));

  app.use(express.static(__dirname + '/public'));

  switch (process.env.NODE_ENV) {
    case 'production':
      app.use(errorHandler());
      app.set('napkin', 0);
      break;
    case 'development':
      app.use(errorHandler({ dumpExceptions: true, showStack: true }));
      app.set('napkin', 1);
      break;
    case 'test':
      app.use(errorHandler({ dumpExceptions: true, showStack: true }));
      app.set('napkin', 2);
      break;
    default:
      throw new Error('Unknown environment');
  }

  app.use(function(req, res, next) {
    res.locals.session = req[nconf.get('session_cookie')];
    return next();
  });

  return app;
};
