var rooms = require('./inMemory.js');
var Dice = require('./../utils/dice.js');
const config = require('config');

class Roll {

    processEvent(query) {
        let dice_val = Dice.roll();
        let player_id = rooms[query.room_id].players[query.player_no-1];
        let game = rooms[query.room_id].game;
        let current_player = game[player_id];
        current_player.score = current_player.score + dice_val;
        if(current_player.score >= config.get('game.winning_score')) {
            rooms[query.room_id].status = 'complete';
            rooms[query.room_id].winner = player_id; 
        }
        if(!rooms[query.room_id].winner) {
            //set next player turn
            let next_player_id;
            if(query.player_no == rooms[query.room_id].players.length) {
                next_player_id = rooms[query.room_id].players[0];
            } else {
                next_player_id = rooms[query.room_id].players[query.player_no];
            }
            rooms[query.room_id].player_turn = next_player_id;
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

module.exports = Roll;