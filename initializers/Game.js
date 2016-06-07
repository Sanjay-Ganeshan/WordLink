'use strict';

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    api.Game = {
      constructGame: function () {
        var newGame = {};
        var generator = api.PhraseGenerator;
        newGame.players = [];
        newGame.currentTurn = 0;
        newGame.currentWordFront = 0;
        newGame.currentWordBack = 0;
        newGame.currentLetter = 0;
        newGame.numWordsInChain = 3;
        newGame.numRetriesPerGeneration = 30;
        newGame.currentPhrase = generator(newGame.numWordsInChain,newGame.numRetriesPerGeneration);
        newGame.scorePerWord = 100;
        

        newGame.getCurrentPlayer = function () {
          return this.players[this.currentTurn];
        }

        newGame.getCurrentPlayerName = function() {
          return this.getCurrentPlayer().name;
        }
        newGame.fixTurn = function () {
          if (this.players.length == 0) {
            this.currentTurn = 0;
          }
          else {
            while (this.currentTurn >= this.players.length) {
              this.currentTurn -= this.players.length;
            }
          }
        }
        newGame.advanceTurn = function () {
          this.currentTurn += 1;
          this.fixTurn();
        }
        newGame.advanceWordFront = function () {
          this.currentLetter = 0;
          this.currentWordFront += 1;
        }
        newGame.advanceWordBack = function() {
          this.currentLetter = 0;
          this.currentWordBack += 1;
        }
        newGame.advanceLetter = function () {
          this.currentLetter += 1;
        }
        newGame.addPlayer = function (player) {
          player.score = 0;
          this.players.push(player);
        }
        newGame.removePlayer = function (playerId) {
          for(var i = 0; i < this.players.length; i++) {
            if(this.players[i].id == playerId) {
              this.players.splice(i,1);
              this.fixTurn();
              return;
            }
          }
        }
        newGame.getChainSoFar = function () {
          return this.currentPhrase.getChainTill(this.currentWordFront,this.currentWordBack);
        }
        newGame.submitGuessFront = function (guess) {
          if (this.currentPhrase.getWord(this.currentWordFront + 1) == guess) {
            //The guess is right
            //Go to the next word
            this.getCurrentPlayer().score += this.scorePerWord;
            this.advanceWordFront();
          }
          else {
            this.advanceLetter();
            this.advanceTurn();
          }
        }

        newGame.submitGuessBack = function(guess) {
          if (this.currentPhrase.getWordFromBack(this.currentWordBack + 1) == guess) {
            //The guess is right
            //Go to the next word
            this.getCurrentPlayer().score += this.scorePerWord;
            this.advanceWordBack();
            
          }
          else {
            this.advanceLetter();
            this.advanceTurn();
          }
        }

        newGame.getHintFront = function () {
          return this.currentPhrase.getHint(this.currentWordFront + 1, this.currentLetter);
        }
        
        newGame.getHintBack = function () {
          return this.currentPhrase.getHint(this.currentPhrase.getIndexOfWordFromBack(this.currentWordBack) - 1, this.currentLetter);
        }

        return newGame;
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
