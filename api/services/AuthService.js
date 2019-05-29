'use strict';

/**
 * AuthService :: Handle Authentication like Login
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

function defaultDependencies () {
  return {
    User: sails.models.user,
  };
}

function Service (dependency) {
  Service.Dependency = dependency;
  return Service;
}


/**
 * Helper function to get Dependencies
 *
 * @returns {*}
 */
function deps() {
  return Object.create(defaultDependencies(), Service.Dependency);
}

const methods = {
  /**
   *  Tries to Login a User. Returns a promise that resolves if correct else rejects if fails.
   *
   * @param {Object} credentials
   * @returns Promise
   */
  login (credentials) {
    const email = credentials.email;
    const password = credentials.password;
    const User = deps().User;

    return new Promise((resolve, reject) => {
      User.findOne({email: email}, function (err, user) {
        if (!user) {
          return reject('Invalid Email or Password');
        }

        User.comparePassword(password, user, function (err, valid) {
          if (err) {
            return reject('Password Error');
          }

          if (!valid) {
            return reject('Invalid Email or Password');
          } else {
            resolve({
              user: user,
              token: JWTTokenService.issue({id : user.id })
            });
          }
        });
      })
    });

  },

  /**
   *  Tries to Register a User. Returns a promise that resolves if correct else rejects if fails.
   *
   * @param {Object} userData
   * @returns Promise
   */
  register (userData) {
    const User = deps().User;

    return new Promise((resolve, reject) => {
      User.findOrCreate(userData, userData, function (err, user) {
        if (err) {
          if(err.invalidAttributes) {
            return reject({validationErrors: err.Errors, msg: 'Some required parameters are' +
            ' missing.'});
          } else {
            return reject('Invalid Email or Password');
          }
        }

        resolve(Object.assign(user, {token: JWTTokenService.issue({id : user.id })}));
      })
    });

  },
};

Object.assign(Service, methods, {Dependency: {}});

module.exports = Service;
