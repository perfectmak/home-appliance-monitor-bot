'use strict';

/**
 *
 * @author Perfect Makanju<developer@perfects.engineering>.
 */

const NLPResponse = {
  /**
   * Returns a normal response object
   *
   * Sample Rasa Response is:
   *  {
   *     entities: [
   *     {
   *      end: 3,
   *      entity: "state",
   *       start: 0,
   *      value: "off"
   *     },
   *     {
   *      end: 13,
   *      entity: "context",
   *      start: 8,
   *      value: "light"
   *     }],
   *     intent: {
   *      confidence: 0.4300031502746645,
   *      name: "SwitchAppliance"
   *     },
   *     text: "off the light"
   *  }
   *
   * This would return a response of type
   * {
   *  intent: "SwitchAppliance",
   *  confidence: 0.4300031502746645,
   *  entities: [
   *    {
   *      name: "state",
   *      value: "off"
   *    },
   *    {
   *      name: "context"
   *      value: "light"
   *    }
   *  ],
   *  text: "Off the light"
   * }
   *
   * @param rasaResponse
   * @return Object { intent, confidence, entities, text }
   */
  fromRasaResponse(rasaResponse) {
    const response = {
      intent: rasaResponse.intent.name,
      confidence: rasaResponse.intent.confidence,
      entities: rasaResponse.entities.map(entity => ({
          name: entity.entity,
          value: entity.value
        })),
      text: rasaResponse.text
    };

    return response;
  }
};


module.exports = NLPResponse;
