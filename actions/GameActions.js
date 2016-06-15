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
  };

var loginAndGuessInputs = {
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
    guess: {
      required: true,
      formatter: function (param) {
        return String(param);
      }
    }
};

var loginAndDirectionInputs = {
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
    direction: {
      required: true,
      formatter: function(param) {
        if(param == "front") {
          return true;
        }
        else if(param == "back") {
          return false;
        }
        else {
          return "ERROR"
        }
      },
      validator: function(param) {
        if(param == "ERROR") {
          return "Parameter must be front or back";
        }
        else {
          return true;
        }
      }
    }
};

/*
var direction = {direction: {
      required: true,
      formatter: function(param) {
        if(param == "front") {
          return true;
        }
        else if(param == "back") {
          return false;
        }
        else {
          return "ERROR"
        }
      },
      validator: function(param) {
        if(param == "ERROR") {
          return "Parameter must be front or back";
        }
        else {
          return true;
        }
      }}};*/

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
      for(var eachGameNum in api.allGames) {
        eachGameNum = +eachGameNum;
        if(api.allGames[eachGameNum].id == data.params.gameId) {
          var worked = api.allGames[eachGameNum].addPlayer(player);
          if(worked) {
            data.response.gameId = api.allGames[eachGameNum].id;
            next();
            return;
          }
          else {
            next(new Error("Game has already started!"));
            return;
          }
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
    //console.log(player);
    if(player.getGame() != null) {
      next(new Error("Player is already in a game!"));
      return;
    }
    else {
      var newGame = api.Game.constructGame();
      newGame.addPlayer(player);
      api.allGames.push(newGame);
      data.response.gameId = newGame.id;
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

exports.leaveGame = {
  name: 'leaveGame',
  description: 'I try leaving the game',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginInputs,

  run: function (api, data, next) {
    let error = null;
    var gameIds = [];
    var player = data.response.userParam;
    var playerGame = player.getGame();
    if(playerGame != null) {
      if (playerGame.isTurnOf(player)) {
        if(!playerGame.directionChosen()) {
          var worked = playerGame.removePlayer(player.id);
          if (worked) {
            data.response.gameId = playerGame.id;
            next();
            return;
          }
          else {
            next(new Error("Failed to leave game!"));
            return;
          }
        }
        else {
          next(new Error("Direction has already been chosen!"));
          return;
        }
      } 
      else {
        next(new Error("It is not your turn!"));
        return;
      }
    }
    else {
      next(new Error("Player is not in a game!"));
      return;
    }
  }
};

exports.submitGuessPlayer = {
  name: 'submitGuess',
  description: 'I try submitting guesses for authenticated players. If it is not their turn, I tell them so',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginAndGuessInputs,

  run: function (api, data, next) {
    let error = null;
    var gameIds = [];
    var player = data.response.userParam;
    var playerGame = player.getGame();
    if(playerGame != null) {
      if (playerGame.isTurnOf(player)) {
        if(playerGame.directionChosen()) {
          var worked = playerGame.submitGuess(data.params.guess);
          data.response.isCorrect = worked;
          next();
          return;
        }
        else {
          next(new Error("Direction has not been chosen!"));
          return;
        }
      } 
      else {
        next(new Error("It is not your turn!"));
        return;
      }
    }
    else {
      next(new Error("Player is not in a game!"));
      return;
    }
  }
};

exports.getHint = {
  name: 'getHint',
  description: 'I try getting the hint as the current player',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginInputs,

  run: function (api, data, next) {
    let error = null;
    var gameIds = [];
    var player = data.response.userParam;
    var playerGame = player.getGame();
    if(playerGame != null) {
      if (playerGame.isTurnOf(player)) {
        if(playerGame.directionChosen()) {
          var hint = playerGame.getHintCurrent();
          data.response.hint = hint;
          data.response.direction = playerGame.getDirection();
          next();
          return;
        }
        else {
          next(new Error("Direction has not been chosen!"));
          return;
        }
      } 
      else {
        next(new Error("It is not your turn!"));
        return;
      }
    }
    else {
      next(new Error("Player is not in a game!"));
      return;
    }
  }
};

exports.getCurrentPhrase = {
  name: 'getCurrentPhrase',
  description: 'I try getting the phrase as the current player',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginInputs,

  run: function (api, data, next) {
    let error = null;
    var gameIds = [];
    var player = data.response.userParam;
    var playerGame = player.getGame();
    if(playerGame != null) {
      data.response.phrase = playerGame.getChainSoFar();
      next();
    }
    else {
      next(new Error("Player is not in a game!"));
      return;
    }
  }
};

exports.getGameSummary = {
  name: 'getGameSummary',
  description: 'I try getting the game summary as the current player',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginInputs,

  run: function (api, data, next) {
    let error = null;
    var gameIds = [];
    var player = data.response.userParam;
    var playerGame = player.getGame();
    if(playerGame != null) {
      data.response.summary = playerGame.getSummaryState();
      next();
      return;
    }
    else {
      next(new Error("Player is not in a game!"));
      return;
    }
  }
};

exports.submitDirection = {
  name: 'submitDirection',
  description: 'I try setting the direction as the current player',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginAndDirectionInputs,

  run: function (api, data, next) {
    let error = null;
    var gameIds = [];
    var player = data.response.userParam;
    var playerGame = player.getGame();
    if(playerGame != null) {
      if (playerGame.isTurnOf(player)) {
        if(!playerGame.directionChosen()) {
          var worked = playerGame.setDirectionFromPlayer(data.params.direction);
          data.response.Success = worked;
          //console.log("Direction submission worked");
          next();
          return;
        }
        else {
          next(new Error("Direction has already been chosen!"));
          return;
        }
      } 
      else {
        next(new Error("It is not your turn!"));
        return;
      }
    }
    else {
      next(new Error("Player is not in a game!"));
      return;
    }
  }
};

exports.getIsPlayerTurn = {
  name: 'askIfTurn',
  description: 'I tell the player if it is their turn',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: ['authPlayer'],

  inputs: loginInputs,

  run: function (api, data, next) {
    let error = null;
    var gameIds = [];
    var player = data.response.userParam;
    var playerGame = player.getGame();
    if(playerGame != null) {
        data.response.isTurn = playerGame.isTurnOf(player);
        next()
        return;
    }
    else {
      next(new Error("Player is not in a game!"));
      return;
    }
  }
};

exports.getGame = {
  name: 'getGame',
  description: 'I get the information for a game',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {gameId: {required: true, formatter: function(param) {return String(param)}}},

  run: function (api, data, next) {
    let error = null;
    for(var eachGameNum in api.allGames) {
      eachGameNum = +eachGameNum;
      if(api.allGames[eachGameNum].id == data.params.gameId) {
        data.response.game = api.allGames[eachGameNum];
      }
    }
    next();
  }
};


