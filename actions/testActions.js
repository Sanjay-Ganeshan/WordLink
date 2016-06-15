'use strict';

exports.action = {
  name:                   'testActions',
  description:            'testActions',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {},

  run: function(api, data, next) {
    let error = null;

    data.response.testNull = null;

    next(error);
  }
};
