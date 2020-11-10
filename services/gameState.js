var rooms = require('./inMemory.js');

class GameState {

    game(room_id) {
        return rooms[room_id];
    }

}

module.exports = GameState