'use strict';

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    api.Player = {
      generateGuid: function () {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      },
      constructPlayer: function (name, password) {
        var newPlayer = {};
        newPlayer.name = name;
        newPlayer.id = this.generateGuid();
        newPlayer.score = 0;

        newPlayer.authenticate = function (pass) {
          return pass == password;
        }

        newPlayer.getGame = function() {
          for(var eachGameIndex in api.allGames) {
            eachGameIndex = +eachGameIndex;
            if(api.allGames[eachGameIndex].playerInGame(this.id)) {
              return api.allGames[eachGameIndex];
            }
          }
          return null;
        }
        return newPlayer;
      }
    };
    var authMiddleware = {
      name: 'authPlayer',
      global: false,
      priority: 1000,
      preProcessor: function (data, next) {
        for (var i in api.RegisteredPlayers) {
          i = +i;
          if (api.RegisteredPlayers[i].name == data.params.username && 
          api.RegisteredPlayers[i].authenticate(data.params.password)) {
            data.response.userParam = api.RegisteredPlayers[i];
            console.log(data.response.userParam);
            next();
            return;
          }
        }
        var error = new Error("ERROR. Not real user");
        next(error);
      },
      postProcessor: function (data, next) {
        delete data.response.userParam;
        next();
      }
    };

    api.actions.addMiddleware(authMiddleware);

    next();
  },
  start: function (api, next) {
    api.RegisteredPlayers = [];
    next();
  },
  stop: function (api, next) {
    next();
  }
};
