'use strict';

/**
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */
function UserService() {
  return UserService;
}

/**
 * Creates a new user and links accounts
 *
 * @param User
 * @param facebookId
 * @param messengerId
 * @param promise
 */
function createAndLink(User, facebookId, messengerId, promise) {
  User.create({facebook_id: facebookId, messenger_id: messengerId}, (err, user) => {
    if(err) {
      promise.reject(err);
    } else {
      promise.resolve(user);
    }
  })
}

/**
 * Links an existing user's messengerId to his facebookId
 *
 * @param User
 * @param facebookId
 * @param messengerId
 * @param promise
 */
function linkUser(User, facebookId, messengerId, promise) {
  User.update({facebook_id: facebookId}, {messenger_id: messengerId})
    .then(updatedUser => promise.resolve(updatedUser[0]))
    .catch(promise.reject);
}

const methods = {
  /**
   * Checks if a user exists
   *
   * @param params
   * @returns {Promise}
   */
  findOne(params) {
    const User = sails.models.user;
    return User.findOne(params)
      .catch(err => {
        sails.log.error(err);
      });
  },

  /**
   * Links messengerId with facebookId.
   * If facebook user doesn't exist, will create a new user
   *
   * @param facebookId
   * @param messengerId
   */
  linkUser(facebookId, messengerId) {
    const User = sails.models.user;

    return new Promise((resolve, reject) => {
      this.findOne({facebook_id: facebookId}).then(user => {
        if(user) {
          linkUser(User, facebookId, messengerId, {resolve, reject})
        } else {
          createAndLink(User, facebookId, messengerId, {resolve, reject})
        }
      });
    });
  }
};

Object.assign(UserService, methods);


module.exports = UserService;
