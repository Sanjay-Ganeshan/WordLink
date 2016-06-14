'use strict';

exports.action = {
  name:                   'testWordGen',
  description:            'testWordGen',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {},

  run: function(api, data, next) {
    let error = null;
    var myGame = api.Game.constructGame();
    data.response.phrase1 = myGame.currentPhrase.getChain();
    myGame.createNewWord();
    data.response.phrase2 = myGame.currentPhrase.getChain();
    myGame.createNewWord();
    data.response.phrase3 = myGame.currentPhrase.getChain();
    myGame.createNewWord();
    data.response.phrase4 = myGame.currentPhrase.getChain();
    myGame.createNewWord();
    data.response.phrase5 = myGame.currentPhrase.getChain();
    myGame.createNewWord();
    next(error);
  }
};
