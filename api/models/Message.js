/**
 * Appliances.js
 *
 * @description :: Represents the Messages sent on the platform
 */

module.exports = {

  attributes: {
    senderId: {
      type: 'string'
    },
    text: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    }
  },

};

