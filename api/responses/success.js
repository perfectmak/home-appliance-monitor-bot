/**
 * 200 (SUCCESS) Response
 *
 * Usage:
 * return res.success(data);
 * return res.success(data, 201);
 *
 * @param  {Object} data
 * @param  {String|Object} statusCode
 *          - defaults to 200
 */

module.exports = function success (data, statusCode) {
  const req = this.req;
  const res = this.res;
  const sails = req._sails;

  sails.log.silly('res.fail() :: Sending 401 ("CREATED") response');

  res.status(statusCode || 200);

  const responseData = (typeof data == 'string') ? {msg: data} : data;
  return res.json({status: 'success', data: responseData});
};
