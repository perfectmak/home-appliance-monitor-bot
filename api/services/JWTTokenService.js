/**
 * JWTTokenService
 *
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

const jwt = require('jsonwebtoken'),
  tokenSecret = "school_is_for_losers";

// Generates a token from supplied payload
module.exports.issue = function(payload) {
  return jwt.sign(
    payload,
    tokenSecret,
    { expiresIn: "80 days" }
  );
};

// Verifies token on a request
module.exports.verify = function(token, callback) {
  return jwt.verify(
    token,
    tokenSecret,
    {},
    callback
  );
};
