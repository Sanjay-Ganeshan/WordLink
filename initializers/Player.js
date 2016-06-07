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
        newPlayer.authenticate = function(pass) {
          return pass == password;
        }
        return newPlayer;
      }
    };

    next();
  },
  start: function (api, next) {
    next();
  },
  stop: function (api, next) {
    next();
  }
};
