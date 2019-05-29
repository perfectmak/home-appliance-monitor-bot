'use strict';

const describe = require('mocha').describe;
const beforeEach = require('mocha').beforeEach;

const sinon = require('sinon');

describe('MessengerService', function() {
  let messengerService;
  let requestDispatcherMock;

  beforeEach(function() {
    requestDispatcherMock = sinon.mock();
    messengerService = MessengerService(sails.config.messenger, requestDispatcherMock);
  });

  describe('#sendMessage()', function() {

    it('should make valid request', function (done) {
      const testRecipientId = 2;
      const testMessage = 'some test message';
      const expectedJsonBody = {
        recipient: {id: testRecipientId},
        message: testMessage,
      };

      requestDispatcherMock.once().withArgs(sinon.match({json: expectedJsonBody}));
      requestDispatcherMock.yields(null, {}, {});

      messengerService.sendMessage(testRecipientId, testMessage)
        .then((success) => {
          requestDispatcherMock.verify();
          done();
        })
        .catch(done);
    });
  });

  describe('#sendAction()', function() {

    it('should make valid request', function (done) {
      const testRecipientId = 2;
      const testAction = messengerService.Action.TYPING_ON;
      const expectedJsonBody = {
        recipient: {id: testRecipientId},
        sender_action: testAction,
      };

      requestDispatcherMock.once().withArgs(sinon.match({json: expectedJsonBody}));
      requestDispatcherMock.yields(null, {}, {});

      messengerService.sendAction(testRecipientId, testAction)
        .then((success) => {
          requestDispatcherMock.verify();
          done();
        })
        .catch(done);
    });
  });
});
