'use strict';
var fs = require('fs');

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
        newPhrase.getWord = function(wordNum) {
          if (this.words.length == 0) {
            return;
          }
          else {
            while(wordNum < 0) {
              wordNum += this.words.length;
            }
            while(wordNum >= this.words.length) {
              wordNum -= this.words.length;
            }
            return this.words[wordNum]; 
          }
        }
        newPhrase.hash = function() {
          var hashVal = "";
          for(var i in this.words) {
            hashVal += this.words[i].substring(0,3);
          }
          return hashVal;
        }
        newPhrase.equals = function(otherPhrase) {
          for(var i in this.words) {
            if (this.words[i] != otherPhrase.words[i]) {
              return false;
            }
          }
          return true;
        }
        newPhrase.toString = function() {
          return this.words.toString();
        }
        return newPhrase;
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


    api.initializePhraseGenerator = function(err, data) {
      if (err) throw err;
      var allPhrasesStrings = data.replace(/\r/g,'').split('\n');
      var allPhrases = [];
      for(var eachPhraseStringIndex in allPhrasesStrings) {
        var eachPhraseString = allPhrasesStrings[eachPhraseStringIndex];
        allPhrases.push(api.Phrase.constructPhrase(eachPhraseString));
      }
      var getGenerator = function() {
        let constructDictionary = function() {
          var newDictionary = {};
          newDictionary.keys = [];
          newDictionary.size = function() {
            return this.keys.length;
          }
          newDictionary.get = function(key) {
            var hashedKey = key.hash();
            if(typeof newDictionary[hashedKey] === "undefined") {
              //Key is not in the dictionary
              throw "Error: Key hash not in dictionary";
            }
            else {
              for(var eachKeyIndex in newDictionary[hashedKey]) {
                var eachKey = newDictionary[hashedKey][eachKeyIndex];
                if(eachKey.key.equals(key)) {
                  //this is the same as before, return the value
                  return eachKey.value
                }
            }
            throw "Error: Key hash found, key not in dictionary";
            }
          }
          newDictionary.set = function(key,value) {
            var hashedKey = key.hash();
            newDictionary.keys.push(key);
            if(typeof newDictionary[hashedKey] === "undefined") {
              //Key hash is not already in the dictionary
              newDictionary[hashedKey] = [];
              newDictionary[hashedKey].push({"key": key, "value": value});
              return true;
            }
            else {
              //Key hash is already in the dictionary
              for(var eachKeyIndex in newDictionary[hashedKey]) {
                var eachKey = newDictionary[hashedKey][eachKeyIndex];
                if(eachKey.key.equals(key)) {
                  //this is the same as before, replace the value
                  eachKey.value = value;
                  return true;
                }
              }
              newDictionary[hashedKey].push({"key":key,"value":value});
              return true;
            }
          }
          newDictionary.toString = function() {
            var retVal = "";
            for(var index in this.keys) {
              retVal += this.keys[index].toString() + ":" + this.get(this.keys[index]).toString();
              retVal += "\n"
            }
            return retVal;
          }
          return newDictionary;
        }
        var allPhrasesDict = constructDictionary();
        //console.log("Constructed dictionary");
        for(var eachPhraseIndex in allPhrases) {
          var eachPhrase = allPhrases[eachPhraseIndex];
          allPhrasesDict.set(eachPhrase,[]);
          for(var eachOtherPhraseIndex in allPhrases) {
            var eachOtherPhrase = allPhrases[eachOtherPhraseIndex];
            if(!eachPhrase.equals(eachOtherPhrase) && eachPhrase.getWord(-1) == eachOtherPhrase.getWord(0)) {
              allPhrasesDict.get(eachPhrase).push(eachOtherPhrase);
            }
          }
        }
        let gen = function(desiredWords,numRetries) {
          var numTriesUsed = 0;
          var phrasesToUse = [];
          //console.log(allPhrasesDict.toString());
          while(numTriesUsed < numRetries && phrasesToUse.length < desiredWords) {
            if(phrasesToUse.length == 0) {
              var indexToStart = Math.floor((Math.random() * allPhrasesDict.size()));
              phrasesToUse.push(allPhrasesDict.keys[indexToStart]);
            }
            else {
              var possibleNextPhrases = allPhrasesDict.get(phrasesToUse[phrasesToUse.length-1])
              if(possibleNextPhrases.length == 0) {
                phrasesToUse = [];
                numTriesUsed += 1;
              }
              else {
                var indexToContinue = Math.floor((Math.random() * possibleNextPhrases.length));
                phrasesToUse.push(possibleNextPhrases[indexToContinue]);
              }
              if(numTriesUsed == numRetries && desiredWords > 1) {
                desiredWords -= 1;
                numTriesUsed = 0;
              }
            }
            //console.log(phrasesToUse.toString());
          }
          return api.Phrase.constructPhraseChain(phrasesToUse);
        }
        return gen;
      }
      api.PhraseGenerator = getGenerator();
    }
    
    /*
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
    }*/

    next();
  },
  start: function (api, next) {
    //api.initializePhraseGenerator();
    fs.readFile('./files/dataFiles/allPhrases.txt','utf8', api.initializePhraseGenerator);
    next();
  },
  stop: function (api, next) {
    next();
  }
};
