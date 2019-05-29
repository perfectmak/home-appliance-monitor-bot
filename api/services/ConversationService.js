'use strict';

/**
 * Handles most conversation related service required
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

function getConversationStateModel() {
  return sails.models.conversationstate;
}

module.exports = {

  /**
   * Get Conversation State of a user with userId, if any.
   * Returns a promise that resolves to the users conversation state or undefined if none.
   *
   * @param query
   * @returns {*|Promise}
   */
  getConversation(query) {
    const ConversationState = getConversationStateModel();
    return ConversationState.findOne(query)
      .catch(sails.log.error);
  },

  /**
   * Inserts or Updates an existing conversation state.
   *
   * @param conversationState
   * @return Promise.<ConversationState>
   */
  saveConversation(conversationState) {
    const ConversationState = getConversationStateModel();
    const query = { userId: conversationState.userId };
    return ConversationState.findOne(query)
      .then((existingState) => {
        if(existingState) {
          return ConversationState.update(query, conversationState)
            .then(conversationStates => conversationStates[0]);
        } else {
          return ConversationState.create(conversationState);
        }
      });
  },

  /**
   *
   * @param conversationState
   * @return {Promise.<T>}
   */
  deleteConversation(conversationState) {
    const ConversationState = getConversationStateModel();
    return ConversationState.destroy({ userId: conversationState.userId })
      .catch(err => {
        sails.log.error('Error deleting Conversation');
        sails.log.error(err); console.log(err);
        return Promise.reject(err);
      });
  },

  /**
   * Returns a copy of the conversation
   *
   * @param conversationState
   * @return {userId, intent, entities, grounded, entityRequested}}
   */
  cloneConversation(conversationState) {
    return getConversationStateModel().clone(conversationState);
  },

  /**
   * Process users message
   *
   * @param message
   */
  processMessage(message) {
    const UserService = sails.services.userservice();
    const MessengerConfig = sails.config.messenger;
    const MessengerService = sails.services.messengerservice(MessengerConfig);
    const ConversationManager = require('../conversations/ConversationManager');

    UserService.findOne({messenger_id: message.senderId})
      .then(user => ConversationManager.delegate(user, message))
      .catch(err => {
        sails.log.error(`Error checking existing user`);
        sails.log.error(err);
        console.log(err);
        MessengerService.sendMessage(message.senderId, "I'm currently having some technical" +
          " issues. Please try messaging me later.");
        MessengerService.sendMessage(message.senderId, "I'll also let you know when I'm back" +
          " online.");
      });
  }
};
