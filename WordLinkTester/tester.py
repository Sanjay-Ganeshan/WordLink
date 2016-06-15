import os
import requests
import time

global printWidth
printWidth = 80

class WordLinkServer:
    def __init__(self):
        self.server = ""
        self.Username = ""
        self.Password = ""

    def sendPostRequest(self, actionName, inputs, authPlayer = False):
        if authPlayer:
            inputs['username'] = self.Username
            inputs['password'] = self.Password
        r = requests.post(self.server + "api/" + actionName, data=inputs)
        if r.ok:
            return r.json()
        else:
            raise Exception(r.json()['error'])

    def sendGetRequest(self, actionName):
        r = requests.get(self.server + "api/" + actionName)
        if r.ok:
            return r.json()
        else:
            raise Exception(r.json()['error'])

    def setServer(self, server):
        self.server = server
        if(not(self.server.endswith("/"))):
            self.server += "/"

    def setLogin(self, username, password):
        self.Username = username
        self.Password = password

    def joinGame(self, gameId):
        actionName = "joinGame"
        try:
            response = self.sendPostRequest(actionName,{"gameId": gameId},True)
            return True, {"gameId": gameId}
        except Exception,e:
            return False, {"error": "Failed to join server.." + str(e)}
    
    def leaveGame(self):
        actionName = "leaveGame"
        try:
            response = self.sendPostRequest(actionName,{},True)
            return True, {"gameId": gameId}
        except Exception,e:
            return False, {"error": "Failed to leave server.." + str(e)}


    def createGame(self):
        actionName = "createGame"
        try:
            response = self.sendPostRequest(actionName,{},True)
            return True, {"gameId": response['gameId']}
        except Exception,e:
            return False, {"error": "Failed to create server.." + str(e)}

    def getGamesList(self):
        actionName = "listGames"
        try:
            response = self.sendGetRequest(actionName)
            return True, {"gamesList": response['gamesList']}
        except Exception, e:
            return False, {"error": "Failed to get list.." + str(e)}
    def submitGuess(self, guess):
        actionName = "submitGuess"
        try:
            response = self.sendPostRequest(actionName,{"guess": guess},True)
            return True, {"isCorrect": response['isCorrect']}
        except Exception, e:
            return False, {"error": "Failed to submit guess.." + str(e)}
    def getHint(self):
        actionName = "getHint"
        try:
            response = self.sendPostRequest(actionName,{},True)
            return True, {'hint': response['hint'], 'direction': response['direction']}
        except Exception, e:
            return False, {"error": "Failed to get hint.." + str(e)}
    def getCurrentGamePhrase(self):
        actionName = "getCurrentPhrase"
        try:
            response = self.sendPostRequest(actionName,{},True)
            return True, {'phrase': response['phrase']}
        except Exception, e:
            return False, {"error": "Failed to get phrase.." + str(e)}
    def getCurrentGameSummary(self):
        actionName = "getGameSummary"
        try:
            response = self.sendPostRequest(actionName,{},True)
            return True, {'summary': response['summary']}
        except Exception, e:
            return False, {"error": "Failed to get summary.." + str(e)}

    def submitDirection(self, direction):
        actionName = "submitDirection"
        try:
            response = self.sendPostRequest(actionName,{"direction": direction},True)
            return True, {'direction': direction}
        except Exception, e:
            return False, {"error": "Failed to set direction.." + str(e)}
    
    def getIsTurn(self):
        actionName = "askIfTurn"
        try:
            response = self.sendPostRequest(actionName,{},True)
            return True, {'isTurn': response['isTurn']}
        except Exception, e:
            return False, {"error": "Failed to get current turn data.." + str(e)}

    def createPlayer(self):
        actionName = "createPlayer"
        try:
            response = self.sendPostRequest(actionName,{},True)
            return True, {'playerId': response['playerId']}
        except Exception, e:
            return False, {"error": "Failed to create player.." + str(e)}
        
    def deletePlayer(self):
        pass

    def listUsers(self):
        actionName = "listPlayers"
        try:
            response = self.sendGetRequest(actionName)
            return True, {'userList': response['userList']}
        except Exception, e:
            return False, {"error": "Failed to get user list.." + str(e)}

    def authPlayer(self):
        actionName = "userValid"
        try:
            response = self.sendPostRequest(actionName,{},True)
            return True, {'playerId': response['playerId']}
        except Exception, e:
            return False, {"error": "Failed to authenticate.." + str(e)}
    
        
    


class States:
    CurrentState = 5
    ChooseServer = 5
    ChooseSign = 10
    SignIn = 20
    SignUp = 30
    ChooseJoinOrCreate = 40
    CreateGame = 50
    ChooseGame = 60
    InGame = 70
    PlayingDirection = 80
    PlayingGuess = 90
    CurrentServer = None

def cls():
    os.system("cls")

def switch(value, possibilities):
    try:
        return possibilities[value]()
    except Exception,e:
        #return possibilities['default']()
        print str(e)

def defaultOption():
    print "Not a valid state. Quitting"
    exit()

def optionsMenu(options):
    for optionNum in range(len(options)):
        eachOption = options[optionNum]
        print "%5s%-s" % (str(optionNum+1) + ") ",eachOption)
    while(True):
        strChoice = raw_input("Choice? -> ")
        try:
            choice = int(strChoice)
        except:
            print "Invalid choice, that is not a number. Try again"
            continue
        if((choice-1) < 0 or (choice-1) > len(options)):
            print "Invalid choice, out of range. Try again."
            continue
        return choice-1 #will only be reached if none of the continues are

def askForLogInInfo():
    username = raw_input("Username: ")
    password = raw_input("Password: ")
    States.CurrentServer.setLogin(username,password)

def showSignIn():
    askForLogInInfo()
    worked, info = States.CurrentServer.authPlayer()
    if worked:
        print "Sign in successful! Id: " + info['playerId']
        changeState(States.ChooseJoinOrCreate)
    else:
        print info['error']

def showSignUp():
    askForLogInInfo()
    worked, info = States.CurrentServer.createPlayer()
    if worked:
        print "Sign up successful! Now try signing in. Id: " + info['playerId']
        changeState(States.SignIn)
    else:
        print info['error']

def chooseToSignInOrUp():
    choice = optionsMenu(["Sign in","Sign up"])
    if(choice == 0):
        changeState(States.SignIn)
    elif(choice == 1):
        changeState(States.SignUp)

def showHeader(width):
    print center("Signed in as " + States.CurrentServer.Username, width,"-")

def showCreateGame():
    worked, info = States.CurrentServer.createGame()
    if worked:
        print "Server created! Until you choose a direction, players can join.\nID: " + info['gameId']
        changeState(States.PlayingDirection)
    else:
        changeState(States.ChooseJoinOrCreate)
        print info['error']



def showChooseGame():
    worked, info = States.CurrentServer.getGamesList()
    if worked:
        allGames = info['gamesList']
        choice = optionsMenu(["Refresh List"] + allGames)
        if choice != 0:
            worked2, info2 = States.CurrentServer.joinGame(allGames[choice-1])
            changeState(States.InGame)
    else:
         print info['error']


def showJoinOrCreateChoice():
    choice = optionsMenu(["Join a game", "Create a game"])
    switch(choice, {
        0: lambda: changeState(States.ChooseGame),
        1: lambda: changeState(States.CreateGame),
        'default': defaultOption 
    })

def center(text, width, paddingChar = " "):
    numAdded = 0
    while(len(text) < width):
        if numAdded % 2 == 0:
            text = text + paddingChar
        else:
            text = paddingChar + text
        numAdded += 1
    return text

def align(text, width, paddingLeft = 0, paddingRight = 0, textRight = ""):
    return ("%%%ds%%s%%%ds%%s%%%ds" % (paddingLeft,width - len(text) - len(textRight) - paddingLeft - paddingRight,paddingRight)) % ("",text,"",textRight,"")

def printGame(gameSummary, width):
    print ""
    gameId = "ID: " + gameSummary['gameId']
    print center(gameId, width)
    print ""
    print center(gameSummary['phrase'], width)
    print align("Players:", width, 6, 0,"")
    maxLen = 0
    for eachPlayer in gameSummary['players']:
        if(len(eachPlayer['name']) > maxLen):
            maxLen = len(eachPlayer['name'])
    paddingRight = width - (maxLen + 12)
    currentPlayerName = "The current player"
    for eachPlayer in gameSummary['players']:
        if(eachPlayer['turn']):
            print align("> %s" % eachPlayer['name'], width, 8, paddingRight - len(str(eachPlayer['score'])), str(eachPlayer['score']))
            currentPlayerName = eachPlayer['name']
        else:
            print align("%s" % eachPlayer['name'], width, 10, paddingRight  - len(str(eachPlayer['score'])), str(eachPlayer['score']))
    if gameSummary['direction'] is None:
        print align("%s has not yet chosen a direction" % currentPlayerName,width,6,0,"")
    elif gameSummary['direction']:
        print align("%s is guessing from the front with %d letters" % (currentPlayerName,gameSummary['numHintLetters']),width,6,0,"")
    else:
        print align("%s is guessing from the back with %d letters" % (currentPlayerName,gameSummary['numHintLetters']),width,6,0,"")


def checkIfTurn():
    worked, info = States.CurrentServer.getIsTurn()
    if worked:
        if info['isTurn']:
            changeState(States.PlayingDirection)
        else:
            pass
    else:
        print info['error']

def showCurrentGameStateNotPlaying():
    global printWidth
    worked, info = States.CurrentServer.getCurrentGameSummary()
    if worked:
        printGame(info['summary'], printWidth)
    else:
        print info['error']
    time.sleep(4) #You do not need to redo this step too frequently
    checkIfTurn() #Change state if necessary

def submitDirection(direction): 
    worked, info = States.CurrentServer.submitDirection(direction)
    if worked:
        changeState(States.PlayingGuess)
    else:
        print info['error']

def leaveGame():
    worked, info = States.CurrentServer.leaveGame()
    if worked:
        print "Successfully left game: " + info['gameId']
        changeState(States.ChooseJoinOrCreate)
    else:
        print info['error']

def showCurrentGameStateDirection():
    worked, info = States.CurrentServer.getCurrentGameSummary()
    global printWidth
    if worked:
        printGame(info['summary'], printWidth)
        print "It is your turn. Pick a side to get a hint for, or forfeit.\nCurrent hint length: %d" % info['summary']['numHintLetters']
        choice = optionsMenu(["Leave the game", "Front Word", "Back Word"])
        switch(choice, {
            0: leaveGame,
            1: lambda: submitDirection("front"),
            2: lambda: submitDirection("back"),
            'default': defaultOption
        })
    else:
        print info['error']

def showCurrentGameStateGuess():
    worked, info = States.CurrentServer.getCurrentGameSummary()
    global printWidth
    if worked:
        printGame(info['summary'], printWidth)
        print "It is your turn. Guess a word!"
        worked2, info2 = States.CurrentServer.getHint()
        if worked2:
            print "The next word from the %s starts with: %s" % ("front" if info2['direction'] else "back", info2['hint'])
            guess = raw_input("Guess? - ")
            worked3, info3 = States.CurrentServer.submitGuess(guess)
            if worked3:
                isCorrect = info3['isCorrect']
                print ("Nice! You got it right!" if isCorrect else "Darn, that's not the right word.")
                if isCorrect:
                    changeState(States.PlayingDirection)
                else:
                    changeState(States.InGame)
            else:
                print info3['error']
        else:
            print info2['error']
        
    else:
        print info['error']

def chooseServer():
    newServer = raw_input("Server? - ")
    States.CurrentServer.setServer(newServer)
    changeState(States.ChooseSign)
    
def changeState(newState):
    States.CurrentState = newState

def main():
    global printWidth
    States.CurrentServer = WordLinkServer()
    while(True):
        cls()
        print States.CurrentState
        showHeader(printWidth)
        switch(States.CurrentState,
        {
            States.ChooseServer: chooseServer,
            States.ChooseSign: chooseToSignInOrUp,
            States.SignIn: showSignIn,
            States.SignUp: showSignUp,
            States.ChooseJoinOrCreate: showJoinOrCreateChoice,
            States.CreateGame: showCreateGame,
            States.ChooseGame: showChooseGame,
            States.InGame: showCurrentGameStateNotPlaying,
            States.PlayingDirection: showCurrentGameStateDirection,
            States.PlayingGuess: showCurrentGameStateGuess,
            'default': defaultOption
        })
        time.sleep(1)

if __name__ == "__main__":
    main()