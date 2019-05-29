/**
 * AppliancesController
 *
 * @description :: Server-side logic for managing appliances and their interactions. Also
 * includes sockets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const lodash = require('lodash');
const SocketStore = require('../sockets/SocketStore');
const CommandQueue = require('../../queues/CommandQueue');

const ApplianceService = sails.services.applianceservice();

module.exports = {

  /**
   * Websocket endpoint to allow appliance (client) to connect and identify themselves using the
   * handshake protocol
   *
   * @param req
   * @param res
   * @returns {*}
   */
  connect(req, res) {
    sails.log.info('Client Hardware Identifying itself');
    console.log('Client Hardware Identifying itself', req.body);

    if(!req.isSocket) {
      return res.fail('Identity request must be from socket', 400);
    }

    if(!req.body.hwid) {
      return res.fail('Hardward id is not provided', 400);
    }

    const hardwareId = req.body.hwid;

    //each device has its own room
    sails.sockets.join(req, hardwareId);
    SocketStore.add(hardwareId, req.socket);

    CommandQueue.getCommands(hardwareId)
      .then(commands => {
        console.log('Pending Commands', commands);
        commands.forEach(command => ApplianceService.sendCommandToDevice(hardwareId, command));
      })
      .catch(err => console.log(err));

    res.success('Client acknowledged');
  },

  /**
   * Send message to hardware
   *
   */
  send(req, res) {
    const hwid = req.body.hwid;
    const command = req.body.command;

    if(!hwid || !command) {
      return res.fail('hwid and command are required');
    }
    // MY Pi hwid: 0000000035579a3d //for testing :)
    const socket = SocketStore.get(hwid);
    if(socket != null) {
      console.log('socket is not null');
      socket.emit('message', command)
    }

    res.success('Message Sent');
  },

  /**
   * Get a list of all appliances belonging to a particular user
   * @param req
   * @param res
   */
  list(req, res) {
    const userId = req.param('userId');

    if(req.token.id !== userId) {
      return res.fail('You don\'t have permission to do this.');
    }

    ApplianceService.fetchAllForUser(userId)
      .then(res.success)
      .catch(res.fail);
  },

  /**
   * Create an appliance belonging to a user
   *
   * @param req
   * @param res
   */
  create(req, res) {
    const userId = req.param('userId');

    if(req.token.id !== userId) {
      return res.fail('You don\'t have permission to do this.');
    }

    const allowedParams = [
      'type', 'name', 'context', 'uuid'
    ];

    const applianceData = lodash.pick(req.body, allowedParams);
    ApplianceService.createForUser(userId, applianceData)
      .then(res.success)
      .catch(res.fail);
  }
};

