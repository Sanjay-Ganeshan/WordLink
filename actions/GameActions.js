'use strict';

var loginInputs = {
  username: {
    required: true,
    formatter: function (param) {
      return String(param);
    }
  },
  password: {
    required: true,
    formatter: function (param) {
      return String(param);
    }
  }
}

var loginAndGameInputs = {
    username: {
      required: true,
      formatter: function (param) {
        return String(param);
      }
    },
    password: {
      required: true,
      formatter: function (param) {
        return String(param);
      }
    },
    gameId: {
      required: true,
      formatter: function (param) {
        return String(param);
      }
    }
  }

exports.joinGame = {
  name: 'joinGame',
  description: 'I let a player join a game if they correctly authenticate',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginAndGameInputs,

  run: function (api, data, next) {
    let error = null;
    var player = data.response.userParam;
    if(player.getGame() != null) {
      next(new Error("Player is already in a game!"));
      return;
    }
    else {
      for(eachGameNum in api.allGames) {
        eachGameNum = +eachGameNum;
        if(api.allGames[eachGameNum].id == data.params.gameId) {
          api.allGames[eachGameNum].addPlayer(player);
          data.response.status = "Success"
          next();
          return;
        }
      }
    }
    next(new Error("Game ID incorrect!"));
  }
};

exports.createGame = {
  name: 'createGame',
  description: 'I let a player create a game if they correctly authenticate',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginInputs,

  run: function (api, data, next) {
    let error = null;
    var player = data.response.userParam;
    console.log(player);
    if(player.getGame() != null) {
      next(new Error("Player is already in a game!"));
      return;
    }
    else {
      var newGame = api.Game.constructGame();
      newGame.addPlayer(player);
      api.allGames.push(newGame);
      next();
    }
  }
};

exports.gamesList = {
  name: 'listGames',
  description: 'I list all the games currently being played',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {},

  run: function (api, data, next) {
    let error = null;
    var gameIds = [];
    for(var eachGameNum in api.allGames) {
      eachGameNum = +eachGameNum;
      gameIds.push(api.allGames[eachGameNum].id);
    }
    data.response.gamesList = gameIds;
    next();
  }
};