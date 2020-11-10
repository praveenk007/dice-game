var rooms = require('./inMemory.js').rooms;
var Dice = require('./../utils/dice.js');
const config = require('config');
const SessionHandler = require('./sessionHandler');
var gameStatus = require('./../constants/gameStatus')

class Roll {

    processEvent(query) {
        let dice_val = Dice.roll();
        let room = rooms[query.room_id];
        let player_id = room.players[query.player_no-1];
        let current_player = room.game[player_id];
        current_player.score = current_player.score + dice_val;
        //set next player turn
        let next_player_id;
        if(query.player_no == room.players.length) {
            next_player_id = room.players[0];
        } else {
            next_player_id = room.players[query.player_no];
        }
        room.player_turn = next_player_id;
        let nextPlayerSession = new SessionHandler().get(room.game[room.player_turn].session_id);
        if(current_player.score >= config.get('game.winning_score') || 
            (!nextPlayerSession && room.players.length == 2)) {
            room.status = gameStatus.ENDED;
            room.winner = player_id; 
        }
        this.result = room;
    }

    set game(r) {
        this.result = r;
    }

    get game() {
        return this.result;
    }
}

module.exports = Roll;