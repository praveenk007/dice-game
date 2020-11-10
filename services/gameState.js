var rooms = require('./inMemory.js').rooms;

class GameState {

    game(room_id) {
        return rooms[room_id];
    }

}

module.exports = GameState