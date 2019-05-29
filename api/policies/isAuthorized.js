/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

function extractTokenFromRequest(req) {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      const scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        return token = credentials;
      }
    } else {
      throw 'Format is Authorization: Bearer [token]';
    }
  } else if (req.param('token')) {
    const token = req.param('token');
    delete req.query.token;
    return token;
  } else {
    throw 'No Authorization header was found';
  }
}

module.exports = function (req, res, next) {
  try {
    const token = extractTokenFromRequest(req);
    JWTTokenService.verify(token, function (err, decryptedToken) {
      if (err) return res.fail('Invalid Token!');
      req.token = decryptedToken;
      next();
    });
  } catch (e) {
    return res.fail(e);
  }
};
