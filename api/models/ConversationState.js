/**
 * UserConversationState.js
 *
 * @description :: Used to cache the current state of a conversation with a user
 */

module.exports = {

  attributes: {
    userId: {
      type: "string",
      index: true
    },

    intent: {
      type: "string"
    },

    entities: {
      type: "object"
    },

    grounded: {
      type: "boolean",
      defaultsTo: false
    },

    entityRequested: {
      type: "string"
    }
  },

  /**
   * returns a new ConversationState Object.
   *
   * @param conversationState
   * @return Object
   */
  clone(conversationState) {
    return {
      userId: conversationState.userId,
      intent: conversationState.intent,
      entities: conversationState.entities,
      grounded: conversationState.grounded,
      entityRequested: conversationState.entityRequested
    };
  }
};

