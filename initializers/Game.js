'use strict';

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    api.Game = {
      constructGame: function () {
        var generateGuid = function () {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
        }
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
        newGame.id = generateGuid();
        newGame.isForward = null;
        newGame.hasStarted = false;

        newGame.getCurrentPlayer = function () {
          return this.players[this.currentTurn];
        }

        newGame.getSummaryState = function() {
          var summary = {};
          summary.players = []
          for(var i = 0; i < this.players.length; i++) {
            if(i == this.currentTurn) {
              summary.players.push({"name":this.players[i].name,"score": this.players[i].score, "turn":true});
            }
            else {
              summary.players.push({"name":this.players[i].name,"score": this.players[i].score, "turn":false});
            }
          }
          summary.phrase = this.getChainSoFar();
          summary.direction = this.isForward;
          summary.gameId = this.id;
          summary.numHintLetters = this.currentLetter;

          return summary;
        }

        newGame.getCurrentPlayerName = function() {
          return this.getCurrentPlayer().name;
        }

        newGame.isTurnOf = function(otherPlayer) {
          return this.getCurrentPlayer().id == otherPlayer.id;
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
          if(this.hasStarted) {
            return false;
          }
          player.score = 0;
          this.players.push(player);
          return true;
        }

        newGame.playerInGame = function (playerId) {
          for(var i = 0; i < this.players.length; i++) {
            if(this.players[i].id == playerId) {
              return true;
            }
          }
          return false;
        }

        newGame.removePlayer = function (playerId) {
          for(var i = 0; i < this.players.length; i++) {
            if(this.players[i].id == playerId) {
              this.players.splice(i,1);
              this.fixTurn();
              if(this.players.length == 0) {
                for(var j = 0; j < api.allGames.length; j++) {
                  if(api.allGames[j].id == this.id) {
                    api.allGames.splice(j,1);
                    break;
                  }
                }
              }
              return true;
            }
          }
          return false;
        }

        newGame.listPlayerNames = function() {
          var playerNames = []
          for(var eachPlayerIndex in this.players) {
            eachPlayerIndex = +eachPlayerIndex;
            playerNames.push(this.players[eachPlayerIndex].name);
          }
          return playerNames;
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
            return true;
          }
          else {
            this.advanceLetter();
            this.advanceTurn();
            return false;
          }
        }

        newGame.submitGuessBack = function(guess) {
          if (this.currentPhrase.getWordFromBack(this.currentWordBack + 1) == guess) {
            //The guess is right
            //Go to the next word
            this.getCurrentPlayer().score += this.scorePerWord;
            this.advanceWordBack();
            return true;
            
          }
          else {
            this.advanceLetter();
            this.advanceTurn();
            return false;
          }
        }

        newGame.setDirectionFromPlayer = function(isForward) {
          if(this.isForward == null) {
            this.setDirection(isForward);
            //console.log(this.isForward);
            return true;
          }
          else {
            return false;
          }
        }

        newGame.setDirection = function(isForward) {
          this.isForward = isForward;
          this.hasStarted = true;
        }

        newGame.getDirection = function() {
          return this.isForward;
        }

        newGame.submitGuess = function(guess) {
          if(this.isForward == null) {
            return null;
          }
          else {
            var retVal;
            if(this.isForward) {
              retVal = this.submitGuessFront(guess);
            }
            else {
              retVal = this.submitGuessBack(guess);
            }
            this.isForward = null;
            return retVal;
          }
        }

        newGame.directionChosen = function() {
          return this.isForward != null;
        }

        newGame.getHintCurrent = function() {
          if(this.isForward == null) {
            return null;
          }
          else {
            var retVal;
            if(this.isForward) {
              retVal = this.getHintFront();
            }
            else {
              retVal = this.getHintBack();
            }
            return retVal;
          }
        }

        newGame.getHintFront = function () {
          return this.currentPhrase.getHint(this.currentWordFront + 1, this.currentLetter);
        }
        
        newGame.getHintBack = function () {
          return this.currentPhrase.getHint(this.currentPhrase.getIndexOfWordFromBack(this.currentWordBack) - 1, this.currentLetter);
        }

        newGame.createNewWord = function() {
          this.currentPhrase = generator(this.numWordsInChain,this.numRetriesPerGeneration);
          this.currentWordFront = 0;
          this.currentWordBack = 0;
          this.currentLetter = 0;
          this.hasStarted = false;
        }

        return newGame;
      }
    };

    next();
  },
  start: function (api, next) {
    api.allGames = []
    next();
  },
  stop: function (api, next) {
    next();
  }
};
