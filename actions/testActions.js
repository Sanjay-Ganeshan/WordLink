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
    //var myPhrase = api.Phrase.constructPhrase("ball room");
    var gen = function() {
      var testChain = api.Phrase.constructPhraseChain(
      [
        api.Phrase.constructPhrase("ball room"),
        api.Phrase.constructPhrase("room key"),
        api.Phrase.constructPhrase("key card"),
        api.Phrase.constructPhrase("card game"),
        api.Phrase.constructPhrase("game board")
      ]
      );
      return testChain;
    }
    var testGame = api.Game.constructGame(gen);
    //data.response.testGame = testGame;
    data.response.chainOrig = testGame.getChainSoFar();
    data.response.hintFrontOrig = testGame.getHintFront();
    data.response.hintBackOrig = testGame.getHintBack();
    testGame.submitGuessFront("ro");
    data.response.chain2 = testGame.getChainSoFar();
    data.response.hintFront2 = testGame.getHintFront();
    data.response.hintBack2 = testGame.getHintBack();
    testGame.submitGuessFront("room");
    data.response.chain3 = testGame.getChainSoFar();
    data.response.hintFront3 = testGame.getHintFront();
    data.response.hintBack3 = testGame.getHintBack();
    testGame.submitGuessFront("room");
    data.response.chain4 = testGame.getChainSoFar();
    data.response.hintFront4 = testGame.getHintFront();
    data.response.hintBack4 = testGame.getHintBack();
    testGame.submitGuessBack("game");
    data.response.chain5 = testGame.getChainSoFar();
    data.response.hintFront5 = testGame.getHintFront();
    data.response.hintBack5 = testGame.getHintBack();
    next(error);
  }
};
