'use strict';

/**
 * The primary purpose of this module/file is to show the interface that a Intent handler
 * exposes.
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */


/**
 * All handlers must implement this method with exact similar signature.
 *
 * @param dependency Object
 * @param user models/User
 * @param message dto/Message
 */
module.exports = {
  process(dependency, user, message) {
    throw new Error("Process method is not implemented");
  }
};
