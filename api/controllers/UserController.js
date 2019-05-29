/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */

const lodash = require('lodash');

const UserService = sails.services.userservice();

module.exports = {
  /**
   * Account Linking
   *
   * @param req
   * @param res
   */
  link(req, res) {
    const facebookId = req.param('facebook_id');
    const messengerToken = req.param('token');

    if (!facebookId || !messengerToken) {
      return res.fail('facebook_id and token required');
    }

  }
};

