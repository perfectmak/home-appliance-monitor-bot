'use strict';

const sails = require('sails');

before(function(done) {

  sails.lift({
    // configuration for testing purposes
  }, function(err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    server.log.info('*** Sails Server is up and running for test ***');
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.log.info('*** Sails Server is shutting down ***');
  sails.lower(done);
});
