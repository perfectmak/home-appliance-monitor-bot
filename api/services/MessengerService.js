'use strict';

const request = require('request');
const BottleNeck = require('bottleneck');

/**
 * Exposes Messenger Interactions a Service.
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

// To limit Request outwards and enable concurrency
var requestLimiter = new BottleNeck(/*no. of concurrent*/1);

function Messenger(config, requestDispatcher) {
  if(!config) {
    throw new Error('Config for Messenger Service is not provided.');
  }
  Messenger.config = config;
  Messenger.requestDispatcher = requestDispatcher || request;
  return Messenger;
}

/**
 * Sends Message to Messenger
 *
 * @param recipientId String
 * @param message String
 * @param quickReply Array<String>
 * @return {Promise.<T>}
 */
Messenger.sendMessage = function(recipientId, message, quickReply) {
  const messageData = {
    recipient: {id: recipientId},
    message: {text: message},
  };

  if(quickReply && quickReply.constructor && quickReply.constructor.name === 'Array') {
    messageData.message.quick_replies = quickReply.map(reply => {
      return {
        content_type: 'text',
        title: reply,
        payload: reply
      };
    });
  }

  return sendRequest(Messenger.config, messageData)
    .then(success => {
      return Promise.resolve(success);
    })
    .catch(err => {
      console.log(err);
      // sails.log.error('Error sending Messenger messager. TODO: Implement retry logic :)');
      // sails.log.error(err);
    });
};

Messenger.sendAction = function(recipientId, action) {
  const actionData = {
    recipient: {id: recipientId},
    sender_action: action,
  };
  return sendRequest(Messenger.config, actionData)
    .then(success => {
      return Promise.resolve(success);
    });
};

Messenger.postLogin = function(recipientId) {
  const payload = {
    template_type:"button",
    text:"Click here to Login",
    buttons: [
      {
        "type": "account_link",
        "url": Messenger.config.accountLinkingUrl
      }
    ]
  };
  return Messenger.postAttachment(recipientId, payload);
};

Messenger.postUrl = function(receipientId, message, linkText, link) {
  const payload = {
    template_type:"button",
    text: message,
    buttons: [
      {
        "type": "web_url",
        "title": linkText,
        "url": link
      }
    ]
  };
  return Messenger.postAttachment(receipientId, payload);
};

Messenger.postAttachment = function(recipientId, payload) {
  const buttonData = {
    recipient: { id: recipientId },
    message: {
      attachment: {
        type: "template",
        payload: payload
      }
    }

  };
  return sendRequest(Messenger.config, buttonData);
};

function sendRequest(config, data) {
  return requestLimiter.schedule(_sendRequest, config, data);
}

function _sendRequest(config, data) {
  return new Promise((resolve, reject) => {
    Messenger.requestDispatcher({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
          access_token: config.pageAccessToken
        },
        method: 'POST',
        json: data
      },
      function (error, response, body) {
        if (error) {
          reject(error);
          console.log('Error sending Request: ', error);
        } else if (body.error) {
          reject(error);
          console.log('Messenger Request Error: ', response.body.error);
        } else {
          resolve(body);
        }
      });
  });
}

Messenger.Action = {
  TYPING_ON: 'typing_on',
  TYPING_OFF: 'typing_off'
};

module.exports = Messenger;
