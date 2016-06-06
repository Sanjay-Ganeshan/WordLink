'use strict';

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    api.Phrase = {
      constructPhrase: function (words) {
        var allWords = words.split(" ");
        var newPhrase = {}
        newPhrase.words = allWords;
        newPhrase.getLetterByWordIndex = function (wordNum, index) {
          return this.words[wordNum].charAt(index);
        }
        return newPhrase
      },
      constructPhraseChain: function (phrases) {
        var newChain = {};

        newChain.phrases = phrases;
        newChain.words = []
        for (var i = 0; i < phrases.length; i++) {
          newChain.words.push(phrases[i].words[0]);
        }
        newChain.words.push(phrases[phrases.length - 1].words[phrases[phrases.length - 1].words.length - 1]);
        newChain.getLetterByWordIndex = function (wordNum, index) {
          return this.words[wordNum].charAt(index);
        }
        newChain.getChain = function () {
          var retWord = "" + this.words[0];
          for (var j = 1; j < this.words.length; j++) {
            retWord += " " + this.words[j];
          }
          return retWord
        }
        
        /*
        newChain.getChainTill = function (word, index) {
          var retVal = ""
          for (var i = 0; i < word; i++) {
            retVal += this.words[i] + " "
          }
          for (var i = 0; i <= index; i++) {
            retVal += this.words[word].charAt(i);
          }
          return retVal;
        }
        */
        
        newChain.getChainTill = function(wordFrontNum, wordBackNum) {
          var retVal = "";
          var turnToUnderline = function(s) {
            var underlines = "";
            for(var i = 0; i < s.length; i++) {
              underlines += "_";
            }
            return underlines;
          }
          retVal += this.words[0];
          for(var i = 1; i < this.words.length-1; i++ ) {
            if(i <= wordFrontNum || this.words.length-1-i <= wordBackNum) {
              retVal += " " + this.words[i];
            }
            else {
              retVal += " " + turnToUnderline(this.words[i]);
            }
          }
          retVal += " " + this.words[this.words.length-1];
          return retVal;
        }
        
        newChain.getHint = function(wordNum, indexNum) {
          var hint = ""
          for(var i = 0; i < Math.min(this.getWordLength(wordNum)-1,indexNum + 1); i++) {
            hint += this.getWord(wordNum).charAt(i);
          }
          return hint;
        }
        
        newChain.getIndexOfWordFromBack = function (wordFromBackNum) {
          return this.words.length - 1 - wordFromBackNum;
        }
        
        newChain.getChainTillWithReveal = function(wordFrontNum, wordBackNum, revealFront, numLetters) {
          
        }
        newChain.getWord = function(word) {
          return this.words[word];
        }
        newChain.getWordFromBack = function(wordBack) {
          return this.words[this.words.length - 1 - wordBack];
        }
        newChain.getWordLength = function (word) {
          return this.words[word].length;
        }
        newChain.getMaxWord = function () {
          return this.words.length - 1;
        }
        newChain.getNumberOfWords = function () {
          return this.words.length;
        }
        /*
        newChain.getLastIndexOfLastWord = function () {
          return this.getWordLength(this.getNumberOfWords() - 1) - 1;
        }
        
        newChain.isLastWord = function (word) {
          return word == this.getNumberOfWords() - 1;
        }
        newChain.isLastIndexOfWord = function (word, index) {
          return this.words[word].length - 1 == index;
        }
        newChain.isVeryLastChar = function (word, index) {
          return this.isLastWord(word) && this.isLastIndexOfWord(word, index);
        }*/

        return newChain;
      }

    };

    api.PhraseGenerator = function () {
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

    next();
  },
  start: function (api, next) {
    next();
  },
  stop: function (api, next) {
    next();
  }
};
