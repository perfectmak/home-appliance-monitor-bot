'use strict';

/**
 * Validates if a particular value is valid for an entity.
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const validators = {
  state(text) {
    const validStates = ['on', 'off'];
    return validStates.indexOf(text.toLowerCase()) != -1;
  }
};

/**
 * Returns true if the text is a valid value for the entity
 *
 * @param entity
 * @param text
 * @return boolean
 */
module.exports = function validate(entity, text) {
  if(validators.hasOwnProperty(entity)) {
    return validators[entity](text);
  } else {
    return true;
  }
};
