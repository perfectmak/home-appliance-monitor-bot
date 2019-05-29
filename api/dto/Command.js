'use strict';

/**
 * Represents a remote command that can be sent to the raspberry pi.
 *
 * This is more like a factory for constructing the commands in an intuitive way
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const lodash = require('lodash');

const PARAMS = {
  ACTION: {
    READ: 'read',
    WRITE: 'write'
  },

  TYPE: {
    ANALOG: 'analog',
    DIGITAL: 'digital'
  }
};

function CommandFactory(params) {
  const command = Object.assign({}, params);

  /**
   *
   * @param object
   * @return {Object}
   */
  function mergeAndReturnBuilder(object) {
    Object.assign(command, object)
    return builders
  }

  const builders = {

    /**
     * Create a read command
     *
     * @return {Object}
     */
    read() {
      return mergeAndReturnBuilder({ action: PARAMS.ACTION.READ });
    },

    /**
     * Creates a write command
     *
     * @return {Object}
     */
    write() {
      return mergeAndReturnBuilder({ action: PARAMS.ACTION.WRITE});
    },


    /**
     * Set command type to analog
     *
     * @return Object
     */
    analog() {
      return mergeAndReturnBuilder({ type: PARAMS.TYPE.ANALOG });
    },


    /**
     * Set command type to digital
     *
     * @return {Object}
     */
    digital() {
      return mergeAndReturnBuilder({ type: PARAMS.TYPE.DIGITAL });
    },

    /**
     *
     * @param pin
     * @return {Object}
     */
    setPin(pin) {
      return mergeAndReturnBuilder({ pin: pin })
    },

    /**
     *
     * @param value
     * @return {Object}
     */
    setValue(value) {
      return mergeAndReturnBuilder({ value: value })
    },



    /**
     * Check to ensure all the params exists and returns the command object
     *
     * NOTE: 'value' is not requried because of read type of commands
     *
     * @return {Object}
     */
    build() {
      const requiredProps = ['action', 'type', 'pin'];
      const okay = requiredProps.map(Object.prototype.hasOwnProperty.bind(command))
        .reduce((sum, val) => sum && val, true);

      if(!okay) {
        throw new Error('Command required parameters are missing.');
      }

      return command;
    }
  };

  return builders;
}

module.exports = CommandFactory;
