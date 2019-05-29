'use strict';

/**
 * Intent Handler that Introduces HAM bot and requests user to login.
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const LoginHandler = {
  /**
   *
   * @param MessengerService
   * @param user
   * @param message
   */
  process({ MessengerService }, user, message) {
    MessengerService.sendMessage(message.senderId, 'Hi, it seems this is your first' +
      ' chatting with me,' +
      ' Log in with your facebook account so I can identify you');
    MessengerService.postLogin(message.senderId);
  }
};

module.exports = LoginHandler;
