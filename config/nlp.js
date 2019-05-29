'use strict';

/**
 * Contains configurations useful to the nlp service.
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */
module.exports.nlp = {
  rasa: {
    url: process.env.RASA_URL || "http://localhost:5000/parse"
  },
  confidence_threshold: 0.3
};
