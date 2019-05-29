'use strict';

/**
 * Intent Handler for responding to a greeting intent
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

/**
 * Returns a random response for greeting
 *
 * @return string
 */
function getResponse() {
  const responses = [
    'How are you doing? How can I help you today?',
    `It is nice to have you here. What can I do for you today?`,
    `Hey, What would you like me to do?`
  ];

  return responses[Math.floor(Math.random()*responses.length)];
}

const GreetHandler = {
  /**
   *
   * @param MessengerService
   * @param user
   * @param message
   */
  process({ MessengerService }, user, message) {
    const responseText = getResponse();

    MessengerService.sendMessage(message.senderId, responseText,
      ["Switch Appliance", "Ask about Appliance", "Regulate Fan"]);
  }
};

module.exports = GreetHandler;
