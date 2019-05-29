'use strict';

/**
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const Message = {

  getType(payload) {
    if(payload.account_linking)
      return Message.TYPE.ACCOUNT_LINKING;

    if(payload.message)
      return Message.TYPE.TEXT;
  },

  /**
   * Creates a messenger object from Messenger Text.
   *
   *
   * @param payload Messenger Raw 'messsaging' object
   * @returns {
   *    senderId: String,
   *    type: Messenger.TYPE,
   *    text: (Optional) Only if type is Messenger.ACTION.TEXT,
   *    authorizationCode: (Optional) Only if type is Messenger.ACTION.ACCOUNT_LINKING. Maybe null if unlinked
   *    linkStatus: (Optional) linked/unlinked
   *  }
   */
  fromMessenger(payload) {
    const messageObj = {};
    const type = Message.getType(payload);

    if(payload.message) {
      messageObj.text = payload.message.text;
    }

    if(payload.account_linking) {
      messageObj.linkStatus = payload.account_linking.status;
      if(payload.account_linking.status === "linked") {
        messageObj.authorizationCode = payload.account_linking.authorization_code;
      } else {
        messageObj.authorizationCode = null
      }
    }

    return Object.assign(messageObj, {
      senderId: payload.sender.id,
      type: type,
      isText() {
        return type === Message.TYPE.TEXT
      },
      isAccountLinking() {
        return type == Message.TYPE.ACCOUNT_LINKING
      }
    });
  },

  TYPE: {
    TEXT: 'text',
    ATTACHMENT: 'attachment',
    ACCOUNT_LINKING: 'account_linking'
  }
};

module.exports = Message;
