'use strict';

/**
 * Intent Handler for responding to a cancel request intent
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const CancelHandler = {
  /**
   *
   * @param MessengerService
   * @param user
   * @param message
   * @param conversationState
   */
  process({ MessengerService, ConversationService }, user, message, conversationState) {
    const sendMessage = MessengerService.sendMessage.bind(MessengerService, message.senderId);
    if(conversationState) {
      ConversationService.deleteConversation(conversationState)
        .then(() => sendMessage(`Okay. I'll stop. Let me know if you need me to do anything else.`))
        .catch(err => sendMessage(`Oops!. Looks like we are stuck in this conversation for now.` +
            ` Keep trying to clear the conversation till I give you a response :)`))
    } else {
      sendMessage('That\'s weird. I don\'t think you were performing a request. But okay.')
    }
  }
};

module.exports = CancelHandler;
