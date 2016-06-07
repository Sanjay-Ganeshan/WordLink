let generateDictionary = function() {
          var newDictionary = {};
          newDictionary.get = function(key) {
            hashedKey = key.hash();
            if(typeof newDictionary[hashedKey] === "undefined") {
              //Key is not in the dictionary
              throw "Error: Key hash not in dictionary";
            }
            else {
              for(var eachKeyIndex in newDictionary[hashedKey]) {
                eachKey = newDictionary[hashedKey][eachKeyIndex];
                if(eachKey.key.equals(key)) {
                  //this is the same as before, return the value
                  return eachKey.value
                }
            }
            throw "Error: Key hash found, key not in dictionary";
            }
          }
          newDictionary.set = function(key,value) {
            hashedKey = key.hash();
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
          return newDictionary;
        }
        
generateObject = function(a,b) {
  myObj = {
    "a": a,
    "b": b,
    "id": Math.random()
  };
  myObj.hash = function() {
    return "a" + this.a + "b" + this.b;
  }
  myObj.equals = function(otherObj) {
    return this.a == otherObj.a && this.b == otherObj.b && this.id == otherObj.id; 
  }
  return myObj;
}

d1 = generateDictionary();
o1 = generateObject(1,2);
o2 = generateObject(1,2);
o3 = generateObject(2,3);
