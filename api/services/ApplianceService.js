'use strict';

const SocketStore = require('../sockets/SocketStore');
const CommandQueue = require('../../queues/CommandQueue');

/**
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

function ApplianceService() {
  return ApplianceService;
}

const methods = {

  /**
   * Fetches all the Appliances that have been registered with a user
   *
   * @param userId
   * @returns Promise.<Array<Appliance>>
   */
  fetchAllForUser(userId) {
    const Appliance = sails.models.appliance;

    return new Promise((resolve, reject) => {
      Appliance.find({ owner: userId }).exec((err, appliances) => {
        if(err) {
          sails.log.error(err);
          return reject('Error loading user appliances');
        }

        resolve(appliances);
      });
    });
  },

  /**
   * Fetch all appliances registered to user with the `where` condition
   *
   * @param userId string
   * @param where Object
   * @return Promise.<Array<Appliance>>
   */
  fetchForUser(userId, where) {
    const Appliance = sails.models.appliance;
    const criteria = Object.assign({}, where, { owner: userId });
    return Appliance.find(criteria);
  },

  /**
   * Create an appliance for a particular user.
   * Also increments the user count for the appliance
   *
   * @todo Make the user appliance_count increment atomic
   * @param userId
   * @param appliance
   */
  createForUser(userId, appliance) {
    const Appliance = sails.models.appliance;
    const User = sails.models.user;

    return new Promise((resolve, reject) => {
      appliance.owner = userId;
      Appliance.create(appliance, (err, createdAppliance) => {
        if(err) {
          if(err.invalidAttributes) {
            return reject({validationErrors: err.Errors, msg: 'Some required parameters are' +
            ' missing.'});
          } else {
            sails.log.error(err);
            return reject('Error creating an appliance for a user');
          }
        }

        User.findOne(userId)
          // this is required or else, all appliance owner fields wil be null
          .populate('appliances')
          .then(user => {
            if(user) {
              user.appliance_count += 1;
              return User.update(userId, user);
            }
            return Promise.reject('User doesn\'t exist')
          })
          .then(() => resolve(createdAppliance))
          .catch(reject);
      })
    });
  },

  /**
   * Updates an appliance
   *
   * @param userId
   * @param appliance
   * @return {Promise.<T>}
   */
  updateForUser(userId, appliance) {
    const Appliance = sails.models.appliance;

    return Appliance.update({owner: userId, id: appliance.id}, appliance)
      .catch(err => {
        if(err.invalidAttributes) {
          return Promise.reject({validationErrors: err.Errors, msg: 'Some required parameters are' +
          ' missing.'});
        } else {
          sails.log.error(err);
          console.log(err);
          return Promise.reject('Error updating appliance for a user.');
        }
      });
  },

  /**
   * Sends Command to device hardware id.
   *
   *
   * @param device string
   * @param command Object
   * @returns Promise
   */
  sendCommandToDevice(device, command) {

    return new Promise((resolve, reject) => {
      const hwid = device;
      const jsonCommand = JSON.stringify(command);
      const socket = SocketStore.get(hwid);

      if(socket != null) {
        const commandAction = command.action;
        socket.once(`${commandAction}_response`, (responseMsg) => {
          resolve(responseMsg);
        });
        socket.emit('message', jsonCommand);
      } else {
        CommandQueue.addCommand(device, command)
          .then(() => {
            reject('The device is not connected at the moment. But your request will be delivered' +
            ' when device comes online.');
          })
          .catch(err => {
            console.log('Error adding command to queue:', err);
            reject('The device is offline. I would have saved your command to be delivered' +
              ' later, but I\'m experiencing some technical issues right now.');
          });

      }
    });
  }
};


Object.assign(ApplianceService, methods);

module.exports = ApplianceService;
