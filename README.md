# dice-game
a simple 2-player dice game. Winning criteria is to get total sum of dice outcomes >= 61.

## Installation
1. npm install
2. Open 2 tabs in browser and hit http://localhost:3000 in both of them
3. Join the same room (enter same room id in both tabs, create room and random player selection isn't supported in this version)
4. Once room is created, keep rolling the dice.

## Future scope
Timer isn't implemented yet. Node server will keep emitting countdown timer to client which can keep listening to that. Backend will execute roll if timer reaches 0.