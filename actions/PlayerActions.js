'use strict';

var commonInputs = {
  username: {
    required: true,
    formatter: function(param) {
      return String(param);
    }
  },
  password: {
    required: true,
    formatter: function(param) {
      return String(param);
    }
  }
}

exports.createPlayer = {
  name:                   'createPlayer',
  description:            'I create a new player in the user list',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: commonInputs,

  run: function(api, data, next) {
    let error = null;
    api.RegisteredPlayers.push(api.Player.constructPlayer(data.params.username, data.params.password));
    // your logic here
    next(error);
  }
};

exports.deletePlayer = {
  name:                   'deletePlayer',
  description:            'I delete a player from the user list',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ['authPlayer'],

  inputs: commonInputs,

  run: function(api, data, next) {
    data.response.success = true;
    next();
  }
};



exports.userList = {
  name:                   'listPlayers',
  description:            'I list all players',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {},

  run: function(api, data, next) {
    let error = null;
    data.response.userList = api.RegisteredPlayers;
    next(error);
  }
};

