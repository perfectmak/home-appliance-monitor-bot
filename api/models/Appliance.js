/**
 * Appliances.js
 *
 * @description :: Represents the Appliances
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    owner: {
      model: 'user'
    },
    type: {
      type: 'string',
      enum: ['switch', 'fan'],
      required: true
    },
    name: {
      type: 'string', //user given name
      required: true
    },
    context: {
      type: 'string', //basically the name of the room the device is situated
      required: true
    },
    uuid: {
      type: 'string', //unique id to identify the device
      required: true,
      unique: true
    },
    state: {
      type: 'string' //on or off for switch, else int value for fan
    },

    getDeviceId() {
      return this.uuid.split('-')[0];
    },

    getPin() {
      return this.uuid.split('-')[1];
    }
  },

  validationMessages: {
    uuid: {
      required: 'A Hardware ID is required to setup an Appliance.',
      unique: 'A device with this ID has been added before.'
    },
    context: {
      required: 'You need to specify where the device is situated.',
    },
    name: {
      required: 'What is the name of this device? For example: A Cooker.',
    },
    type: {
      required: 'What type of device is this: Is it a switch controlled appliance or fan?',
    }
  },
};

