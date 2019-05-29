/**
 * User.js
 *
 * @description :: Represent a particular user of ham-bot
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    email: {
      type: 'email',
      unique: true
    },
    first_name: {
      type: 'string',
    },
    last_name: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    messenger_id: {
      type: 'string',
      unqiue: true
    },
    facebook_id: {
      type: 'string',
      unique: true
    },
    facebook_token: {
      type: 'string'
    },
    appliance_count: {
      type: 'integer',
      defaultsTo: 0
    },
    appliances: {
      collection: 'appliance',
      via: 'owner'
    },

    toJSON: function () {
      const obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  validationMessages: {
    email: {
      email: 'Provide valid email address',
      unique: 'Email address is already taken'
    }
  },

  beforeCreate : function (values, next) {
    if(!values.password) {
      next();
      return;
    }
    bcrypt.genSalt(10, function (err, salt) {
      if(err)
        return next(err);
      bcrypt.hash(values.password, salt, function (err, hash) {
        if(err)
          return next(err);
        values.password = hash;
        next();
      })
    })
  },

  comparePassword : function (password, user, cb) {
    bcrypt.compare(password, user.password, cb);
  }
};
