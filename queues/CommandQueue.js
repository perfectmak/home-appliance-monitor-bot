'use strict';

/**
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const COMMAND_QUEUE_NAME = 'command';

const lodash = require('lodash');

const ironMq = require('iron_mq');
const client = new ironMq.Client({project_id: process.env.IRON_MQ_PROJECT_ID, token: process.env.IRON_MQ_TOKEN});

function queueName(device) {
  return `${COMMAND_QUEUE_NAME}-${device}`;
}

function getQueue(device) {
  return client.queue(queueName(device));
}

const commandToMessage = JSON.stringify;

const messageToCommand = JSON.parse;

const methods = {
  /**
   * Add a command to a device to the queue
   *
   * @param device string
   * @param command
   * @return {Promise}
   */
  addCommand(device, command) {
    return new Promise((resolve, reject) => {
      const message = commandToMessage(command);
      console.log(`Adding command to ${device} queue`, command);
      getQueue(device).post(message, (err, body) => {
        if(err) {
          reject(err);
        } else {
          resolve(body);
        }
      })
    });
  },

  /**
   * Returns a promise that resolves the list of commands on the queue.
   *
   * @param device
   * @return {Promise}
   */
  getCommands(device) {
    const queue = getQueue(device);
    const options = {n: 100};
    return new Promise((resolve, reject) => {
      queue.reserve(options, (err, messages) => {
        if(err) {
          return reject(err);
        }

        const commands = messages.map(msg => msg.body).map(messageToCommand);
        resolve(commands);

        queue.del_multiple({reservation_ids: messages}, function (error, body) {
          if(error) {
            console.log('Error deleting command messages', error);
          }
        });
      });
    });
  }
};


module.exports = methods;
