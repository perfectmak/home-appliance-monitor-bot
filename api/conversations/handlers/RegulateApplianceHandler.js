'use strict';

/**
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const levenshtein = require('fast-levenshtein');
const lodash = require('lodash');

const CreateCommand = require('../../dto/Command');
const Entity = require('../../models/Entity');
const ValidateEntity = require('../entities/EntityValidator');

/**
 *
 * @param ConversationService
 * @param conversationState
 */
function saveConversationState(ConversationService, conversationState) {
  return ConversationService.saveConversation(conversationState);
}

/**
 * Returns any entity that has not been filled yet.
 *
 * @param entities Object
 * @return {*}
 */
function getNewEntityRequested(entities) {
  if(!entities.appliance) {
    return Entity.Appliance;
  } else if(!entities.state) {
    return Entity.State;
  } else if(!entities.context) {
    return Entity.Context;
  } else {
    return null;
  }
}

/**
 * Checks to ensure that the conversation is grounded for this Handler.
 *
 * @param conversationState
 * @return boolean
 */
function isConversationGrounded(conversationState) {
  const entities = conversationState.entities;
  return !!(entities.appliance && entities.state && entities.context);
}

/**
 * Send a message to request for an entityName from the user.
 * sendMessage is a curry function of MessengerService.sendMessage() with the userId already
 * provided.
 *
 * @param sendMessage Function
 * @param entityName string
 * @return {*}
 */
function requestForEntity(sendMessage, entityName) {
  switch(entityName) {
    case Entity.Appliance:
      return sendMessage('Which appliance would you like to turn on/off?');
    case Entity.State:
      return sendMessage('Would you like to turn it on or off?', ['on', 'off']);
    case Entity.Context:
      return sendMessage(`Where is it located?`);
    default:
      return Promise.resolve(null);
  }
}

/**
 * Send the regulation Command
 *
 * @param ApplianceService
 * @param sendMessage
 * @param conversationState
 */
function regulateAppliance(ApplianceService, sendMessage, conversationState) {
  const entities = conversationState.entities;
  const userId = conversationState.userId;
  const applianceCriteria = { name: entities.appliance, context: entities.context };

  return ApplianceService.fetchForUser(userId, applianceCriteria)
    .then((appliances) => {
      const appliance = appliances[0];
      const deviceId = appliance.getDeviceId();
      const pin = appliance.getPin();

      const command = CreateCommand({ value: entities.state, pin: pin })
        .write().digital().build();

      return sendMessage(`Okay, I'm turning the ${entities.appliance} ${entities.state} now.`)
        .then(() => {
          return ApplianceService.sendCommandToDevice(deviceId, command);
        })
        .then(sendMessage)
        .catch(sendMessage);
    });

}


const RegulateApplianceHandler = {
  /**
   *
   * Expected entities in order of checking
   * - appliance
   * - state
   * - context
   *
   * @param MessengerService
   * @param ConversationService
   * @param ApplianceService
   * @param user
   * @param message
   * @param conversationState
   * @param nlpResponse
   */
  process({ MessengerService, ConversationService, ApplianceService }, user, message, conversationState, nlpResponse) {
    const sendMessage = MessengerService.sendMessage.bind(MessengerService, message.senderId);
    const postUrl = MessengerService.postUrl.bind(MessengerService, message.senderId);
    if(user.appliance_count === 0) {
      postUrl('I see you don\'t have any appliance registered on your account.' +
        ' Please click the button below to register an appliance.', 'Go to Portal',
        MessengerService.config.portalUrl + '/#/appliances/add');

      sendMessage('When you are done adding at least one' +
        ' appliance, then you can come back here to manage the devices.');
      return;
    }

    const newConversationState = (conversationState) ?
      ConversationService.cloneConversation(conversationState) :
      {
        userId: user.id,
        intent: nlpResponse.intent, // SwitchAppliance
        entities: {}
      };

    //extract entities
    const entityRequested = newConversationState.entityRequested;
    if((entityRequested == null) && newConversationState.grounded) {
      //this shouldn't happen really
      //send a friendly message to user.
      sendMessage('It seems your last request wasn\'t attended to properly. Send' +
        ' `Cancel` to clear your previous conversation and lets start again :). ', ['Cancel']);
      return;
    } else if(entityRequested != null) {
      newConversationState.entities[entityRequested] = message.text;
    } else {
      nlpResponse.entities.forEach(entity => {
        newConversationState.entities[entity.name] = entity.value;
      });
    }

    const entities = newConversationState.entities;
    newConversationState.entityRequested = getNewEntityRequested(entities);

    if(entities.appliance && entities.state) {

      ApplianceService.fetchAllForUser(user.id)
        .then(appliances => {
          const matchedAppliances = appliances.filter(appliance => {

            return appliance.name.toLowerCase() === entities.appliance.toLowerCase();
          });

          switch(matchedAppliances.length) {
            case 0:
              postUrl(`Sorry, I can\'t find any appliance with the name '${entities.appliance}'.` +
                ' Check the portal to confirm which one it is.', 'Open Portal',
                MessengerService.config.portalUrl);
              sendMessage('Or perhaps you mean\'t one of these?',
                appliances.map(lodash.property('name')));
              delete entities.appliance;
              newConversationState.entityRequested = Entity.Appliance;
              return false;
              break;
            case 1:
              newConversationState.entities.context = matchedAppliances[0].context;
              return true;
              break;
            default:
              //more than appliance found
              //try and get the context
              if(entities.context) {
                const correctAppliance = lodash.find(matchedAppliances,
                  (appliance) => (appliance.context.toLowerCase() === entities.context.toLowerCase()));
                if(correctAppliance) {
                  newConversationState.entities.context = correctAppliance.context;
                  return true;
                } else {
                  postUrl(`Sorry, I can\'t find the ${entities.appliance} in '${entities.context}'.` +
                    ' Check the portal to confirm where it is located.', 'Open Portal',
                    MessengerService.config.portalUrl);
                  sendMessage('Or perhaps you mean\'t in one of these places?',
                    matchedAppliances.map(lodash.property('context')));
                }
              } else {
                newConversationState.entityRequested = Entity.Context;
                sendMessage(`Which ${entities.appliance}?`,
                  appliances.map(matchedAppliance => matchedAppliance.context));
              }
              return false;
          }
        })
        .then((prevSuccess) => {
          if(!prevSuccess)
            return false;

          if(ValidateEntity(Entity.State, entities.state)) {
            return true;
          } else {
            newConversationState.entityRequested = Entity.State;
            sendMessage('I don\'t understand what to do to the appliance.');
            sendMessage(`Would you like to turn it on or off?`,
              ['on', 'off']);
            return false;
          }
        })
        .then((prevSuccess) => {
          newConversationState.grounded = isConversationGrounded(newConversationState);
          return saveConversationState(ConversationService, newConversationState);
        })
        .then(savedConversationState => {
          if(savedConversationState.grounded) {
            switchAppliance(ApplianceService, sendMessage, savedConversationState)
              .then(() => ConversationService.deleteConversation(savedConversationState));
          }
        })
        .catch(console.log);

    } else {
      requestForEntity(sendMessage, newConversationState.entityRequested)
        .catch(console.log);
      saveConversationState(ConversationService, newConversationState);
    }
  }
};

module.exports = RegulateApplianceHandler;
