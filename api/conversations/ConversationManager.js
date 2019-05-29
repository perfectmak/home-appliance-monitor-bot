'use strict';

/**
 * Conversation Manager delegates the current conversation to the appropriate handler
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */
const MessengerConfig = sails.config.messenger;
const NLPConfig = sails.config.nlp;
const MessengerService = sails.services.messengerservice(MessengerConfig);
const ConversationService = sails.services.conversationservice;
const NLPService = sails.services.nlpservice;

const CreateHandler = require('./handlers/HandlerFactory');

function isCancelMessage(messageText) {
  const cancelKeywords = ['cancel', 'cancel request', 'cancel current request', 'clear', 'clear' +
  ' request', 'cancel conversation', 'clear conversation', 'stop', 'stop what you are doing'];
  return cancelKeywords.indexOf(messageText.toLowerCase()) != -1;
}

function handleNewUser(user, message) {
  if (message.isAccountLinking()) {
    CreateHandler('AccountLinking').process(user, message);
  } else if(message.isText()) {
    console.log('Login new User');
    CreateHandler('Login').process(user, message);
  } else {
    //some other type of message we don't care about for now
  }
}

function handleExistingUser(user, message) {
  if(!message.isText()) {
    return;
  }

  const conversationStatePromise = ConversationService.getConversation({userId: user.id});
  conversationStatePromise.then(conversationState => {
    if(isCancelMessage(message.text)) {
      CreateHandler('Cancel').process(user, message, conversationState);
      return null;
    }

    if(conversationState) {
      CreateHandler(conversationState.intent).process(user, message, conversationState, null);
      return null;
    } else {
      return NLPService.parse(message.text);
    }
  })
  .then(nlpResponse => {
    if(!nlpResponse)
      return;

    if(nlpResponse.confidence < NLPConfig.confidence_threshold) {
      MessengerService.sendMessage(message.senderId, 'Sorry, I don\'t under what you' +
        ' said. Perhaps you can try and rephrase it.');
    } else {
      CreateHandler(nlpResponse.intent).process(user, message, null, nlpResponse);
    }
  })
  .catch(err => {
    sails.log.error('Error Responding to Users\' ', err);
    console.log(err);
    MessengerService.sendMessage(message.senderId, 'My interpretation engine is down at' +
      ' the moment. Please give me a moment, and I\'ll be able to understand you again');
  });
}

const ConversationManager = {
  /**
   * Delegates the Message to the correct message Intent Handler.
   *
   * @param user models/User
   * @param message dto/Message
   */
  delegate(user, message) {
    try {
      if (!user) {
        handleNewUser(user, message)
      } else {
        handleExistingUser(user, message)
      }
    } catch (e) {
      console.log(e);
      sails.log.error(e);
    }
  }
};


module.exports = ConversationManager;
