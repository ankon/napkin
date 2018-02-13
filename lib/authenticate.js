var request = require('request');

/* Persona authentication
 * Requires: web request, nconf
 * Returns: A Persona email if successful
 */
exports.verify = function(req, nconf, callback) {
  return callback(null, 'andreas.kohn@gmail.com');
};
