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
    var newPlayer = api.Player.constructPlayer(data.params.username, data.params.password);
    api.RegisteredPlayers.push(newPlayer);
    data.response.playerId = newPlayer.id;
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
    //TODO: Add delete
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

exports.userValid = {
  name:                   'userValid',
  description:            'I check to make sure credentials are valid',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             ['authPlayer'],

  inputs: commonInputs,

  run: function(api, data, next) {
    data.response.validUser = true;
    data.response.playerId = data.response.userParam.id
    next();
  }
}

