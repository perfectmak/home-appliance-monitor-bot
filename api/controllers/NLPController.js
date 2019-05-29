/**
 * NLPController
 *
 * @description :: Testing out and visualizing the NLP Responses
 */

const NLPService = sails.services.nlpservice;

module.exports = {

  parse(req, res) {
    const query = req.query.q;
    if(!query) {
      return res.fail("Query parameter must be provided");
    }

    NLPService.parse(query)
      .then(res.success)
      .catch(err => {
        sails.log.error(err);
        console.log(err);
        res.fail("An error occurred while parsing it. It will be fixed soon.");
      });
  }
};

