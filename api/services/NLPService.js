'use strict';

const request = require('request');

const NLPResponse = require('../dto/NLPResponse');

/**
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

function NLPService(config, requestDispatcher) {
  NLPService.config = config;
  NLPService.requestDispatcher = requestDispatcher || request;
}

const methods = {
  /**
   * Parses the message and returns a promise that resolves to NLPResponse Object of the result.
   *
   * @param message
   * @return Promise<NLPResponse>
   */
  parse(message) {
    if(typeof message === 'undefined' || message === null) {
      throw new Error("A null or undefined message was provided.")
    }

    return sendRequest({q: message})
      .then(response => {
        return Promise.resolve(NLPResponse.fromRasaResponse(response));
      }).catch(err => {
        sails.log.error(err);
        console.log('NLP Request Error: ', err);
        return Promise.reject(err);
      });
  }
};

function getRequestDispatcher() {
  return NLPService.requestDispatcher || request;
}

function getConfig() {
  return NLPService.config || sails.config.nlp;
}

function sendRequest(data) {
  return new Promise((resolve, reject) => {
    const config = getConfig();
    const requestDispatcher = getRequestDispatcher();
    requestDispatcher({
        url: config.rasa.url,
        method: 'POST',
        json: data
      },
      function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
  });
}

Object.assign(NLPService, methods);

module.exports = NLPService;
