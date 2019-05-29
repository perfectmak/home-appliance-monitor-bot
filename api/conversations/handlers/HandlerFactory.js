'use strict';

/**
 * Used to easily create Intent Handlers with their dependencies already specified.
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const MessengerConfig = sails.config.messenger;
const MessengerService = sails.services.messengerservice(MessengerConfig);
const UserService = sails.services.userservice();
const ConversationService = sails.services.conversationservice;
const ApplianceService = sails.services.applianceservice;

/**
 * Applies dependency to handlerObj's process() function
 *
 * @param dependency
 * @param handlerObj
 * @returns {*}
 */
function applyDependency(dependency, handlerObj) {
  handlerObj.process = handlerObj.process.bind(handlerObj, dependency);
  return handlerObj;
}

const handlers = {
  AccountLinking: {
    module: './AccountLinkingHandler',
    dependency: { UserService, MessengerService }
  },
  Login: {
    module: './LoginHandler',
    dependency: { MessengerService }
  },
  Greet: {
    module: './GreetHandler',
    dependency: { MessengerService }
  },
  ThankYou: {
    module: './ThankYouHandler',
    dependency: { MessengerService }
  },
  Cancel: {
    module: './CancelHandler',
    dependency: { MessengerService, ConversationService }
  },
  SwitchAppliance: {
    module: './SwitchApplianceHandler',
    dependency: { MessengerService, ConversationService, ApplianceService }
  },
  QueryAppliance: {
    module: './QueryApplianceHandler',
    dependency: { MessengerService, ConversationService, ApplianceService }
  },
  RegulateAppliance: {
    module: './RegulateApplianceHandler',
    dependency: { MessengerService, ConversationService, ApplianceService }
  }
};

/**
 * Cache for storing loaded handlers
 *
 * @type {{}}
 */
const handlerCache = {};

/**
 * Creates an handler and applies its dependencies before returning it.
 *
 * Note that since the process() function of the Handler returned is curried, all arguments must
 * be provided before the process() function will be invoked.
 * @todo Fix above issue by refactoring process to accept object instead of single parameters.
 *
 * @param handlerName
 * @returns {*}
 */
function Factory(handlerName) {
  const handlerInfo = handlers[handlerName];
  if(!handlerInfo) {
    throw new Error(`Unknown Handler specified in Factory. Perhaps you haven't registered ${handlerName}`);
  }

  if(!handlerCache[handlerInfo.module]) {
    const handler = require(handlerInfo.module);
    handlerCache[handlerInfo.module] = applyDependency(handlerInfo.dependency, handler);
  }
  return handlerCache[handlerInfo.module];
}


module.exports = Factory;
