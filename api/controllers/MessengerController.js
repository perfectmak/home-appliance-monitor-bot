/**
 * MessengerController
 *
 * @description :: Server-side logic for managing Facebook Messenger interactions
 */
const Message = require('../dto/Message');

const MessengerConfig = sails.config.messenger;
const ConversationService = sails.services.conversationservice;

module.exports = {

  /**
   * Verify that user information is correct
   *
   * @param req
   * @param res
   */
	verify(req, res) {
    sails.log.info('Validation Webhook');
    if (req.query['hub.verify_token'] === MessengerConfig.verifyToken) {
      res.send(req.query['hub.challenge'])
    } else {
      res.send('Error, wrong token')
    }
  },

  /**
   * Handle incoming events/messages from facebook messenger.
   *
   * @param req
   * @param res
   */
  message(req, res) {
    sails.log.info(`New message: ${JSON.stringify(req.body)}`);
    console.log(`New message: ${JSON.stringify(req.body)}`);

    const messages = req.body.entry[0].messaging;
    for (let i = 0; i < messages.length; i++) {
      const userMessage = Message.fromMessenger(messages[i]);
      ConversationService.processMessage(userMessage);
    }

    res.status(200);
    res.send();
  }
};

