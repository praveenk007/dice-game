var rooms = require('./inMemory.js').rooms;
const config = require('config');
var gameStatus = require('./../constants/gameStatus')


class Join {

    processEvent(query) {
        if(!rooms[query.room_id]) {
            rooms[query.room_id] = {
                players: [query.player_id],
                game: {},
                status: gameStatus.CREATED
            };
            rooms[query.room_id].game[query.player_id] = {score: 0, session_id: query.session_id};
        } else {
            if(!rooms[query.room_id].players.includes(query.player_id)) {
                rooms[query.room_id].players.push(query.player_id);
                rooms[query.room_id].game[query.player_id] = {score: 0, session_id: query.session_id};
                if(rooms[query.room_id].players.length == config.get('game.max_players')) {
                    rooms[query.room_id].status = gameStatus.COMMENCED;
                }
                rooms[query.room_id].player_turn = query.player_id;
            }
        } 
        this.result = rooms[query.room_id];
    }

    set game(r) {
        this.result = r;
    }

    get game() {
        return this.result;
    }
}

module.exports = Join