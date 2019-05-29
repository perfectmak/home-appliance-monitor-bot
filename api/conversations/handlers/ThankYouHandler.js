'use strict';

/**
 * Intent Handler for responding to a thank you intent
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const ThankYouHandler = {
  /**
   *
   * @param MessengerService
   * @param user
   * @param message
   */
  process({ MessengerService }, user, message) {
    MessengerService.sendMessage(message.senderId, 'You are welcome. ;)');
  }
};

module.exports = ThankYouHandler;
