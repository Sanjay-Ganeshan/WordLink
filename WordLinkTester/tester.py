import os
import requests
import time

class WordLinkServer:
    def __init__(self, server):
        self.server = server
    def joinGame(username,password, gameId):
        pass
    def createGame(username, password):
        pass
        
    


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
    Username = ""
    Password = ""
    CurrentServer = ""

def cls():
    os.system("cls")

def switch(value, possibilities):
    try:
        return possibilities[value]()
    except Exception:
        return possibilities['default']()

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
    States.Username = username
    States.Password = password

def signIn():
    return True

def signUp():
    return True

def showSignIn():
    askForLogInInfo()
    worked = signIn()
    if worked:
        print "Sign in successful!"
        changeState(States.ChooseJoinOrCreate)
    else:
        print "Sorry, invalid user. Try again."

def showSignUp():
    askForLogInInfo()
    worked = signUp()
    if worked:
        print "Sign up successful! Now try signing in"
        changeState(States.SignIn)
    else:
        print "Sorry, something went wrong. Try again"

def chooseToSignInOrUp():
    choice = optionsMenu(["Sign in","Sign up"])
    if(choice == 0):
        changeState(States.SignIn)
    elif(choice == 1):
        changeState(States.SignUp)

def showHeader():
    print "Signed in as " + States.Username

def createGame():
    pass

def showCreateGame():
    pass

def joinGame():
    pass

def getAllGames():
    pass

def showChooseGame():
    allGames = getAllGames()
    choice = optionsMenu(["Refresh List"] + allGames)
    if choice != 0:
        joinGame(allGames[choice])
    


def showJoinOrCreateChoice():
    choice = optionsMenu(["Join a game", "Create a game"])
    switch(choice, {
        0: lambda: changeState(States.ChooseGame),
        1: lambda: changeState(States.CreateGame),
        'default': defaultOption 
    })


def showCurrentGameStateNotPlaying():
    pass

def showCurrentGameStateDirection():
    pass

def showCurrentGameStateGuess():
    pass

def chooseServer():
    newServer = raw_input("Server? - ")
    States.CurrentServer = newServer
    
def changeState(newState):
    States.CurrentState = newState

def main():
    while(True):
        cls()
        showHeader()
        switch(States.CurrentState,
        {
            States.ChooseServer: chooseServer,
            States.ChooseSign: chooseToSignInOrUp,
            States.SignIn: showSignIn,
            States.SignUp: showSignUp,
            ChooseJoinOrCreate: showJoinOrCreateChoice,
            CreateGame: showCreateGame,
            ChooseGame: showChooseGame,
            InGame: showCurrentGameStateNotPlaying,
            PlayingDirection: showCurrentGameStateDirection,
            PlayingGuess: showCurrentGameStateGuess,
            'default': defaultOption
        })

if __name__ == "__main__":
    main()