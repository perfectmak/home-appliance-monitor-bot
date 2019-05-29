/**
 * 401 (FAILED) Response
 *
 * Usage:
 * return res.fail(data);
 * return res.fail(data, 400);
 *
 * @param  {Object} data
 * @param  {String|Object} statusCode
 *          - defaults to 401
 */

module.exports = function fail (data, statusCode) {
  const req = this.req;
  const res = this.res;
  const sails = req._sails;

  sails.log.silly('res.fail() :: Sending 401 ("CREATED") response');

  res.status(statusCode || 401);

  const responseData = (typeof data == 'string') ? {msg: data} : data;
  return res.json({status: 'failed', data: responseData});
};
