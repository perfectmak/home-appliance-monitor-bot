'use strict';

/**
 * Intent Handler that completes an account linking process.
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const AccountLinkingHandler = {
  /**
   *
   * @param UserService
   * @param MessengerService
   * @param user
   * @param message
   */
  process({ UserService, MessengerService }, user, message) {
    sails.log.info('Account Linking Handler');
    UserService.linkUser(message.authorizationCode, message.senderId)
      .then((user) => {
        sails.log.info(`User (${user.messenger_id}) account linking successful.`);
        MessengerService.sendMessage(message.senderId, "Account Linking Successful.");
      })
      .catch((err) => {
        sails.log.error('User account linking failed. Try again', err);
        MessengerService.sendMessage(message.senderId, "Sorry, an error occurred while I" +
          " was linking" +
          " your account. Please try again.");
        MessengerService.postLogin(message.senderId);
      })
  }
};

module.exports = AccountLinkingHandler;
