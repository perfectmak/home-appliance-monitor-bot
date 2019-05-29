/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const lodash = require('lodash');

const AuthService = sails.services.authservice();

function register(body, allowedParams) {
  const data = lodash.pick(body, allowedParams);

  return AuthService.register(data);
}

module.exports = {

  register(req, res) {
    const allowedParams = [
      'email', 'password', 'first_name', 'last_name'
    ];

    register(req.body, allowedParams)
      .then(res.success)
      .catch(res.fail);
  },

  registerFb(req, res) {
    const allowedParams = [
      'email', 'facebook_id'
    ];

    register(req.body, allowedParams)
      .then(res.success)
      .catch(res.fail);
  },

	login(req, res) {
    const email = req.param('email');
    const password = req.param('password');

    if (!email || !password) {
      return res.fail('Email and Password required');
    }

    AuthService.login({email, password})
      .then(res.success)
      .catch(res.fail);
  }
};

