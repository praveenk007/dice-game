# dice-game
a simple 2-player dice game. Winning criteria is to get total sum of dice outcomes >= 61.

## Installation
1. npm install
2. Open 2 tabs in browser and hit http://localhost:3000 in both of them
3. Join the same room (enter same room id in both tabs, create room and random player selection isn't supported in this version)
4. Once room is created, keep rolling the dice.

## Use cases handled
1. 2 - 4 players can be configured to play
2. Timer gets activated once the game starts and after each play
3. After 30 seconds of inactivity of current player, dice gets rolled automatically and then passed to the next player in queue
4. If there are 2 players and any one player disconnects, other player becomes the winner
5. Player who reaches the score of 61 wins and the game ends