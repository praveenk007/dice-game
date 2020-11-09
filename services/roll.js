var rooms = require('./inMemory.js');

class Roll {

    processEvent(query) {
        let dice_val = Math.floor(Math.random() * Math.floor(5)) + 1;
        let player_id = rooms[query.room_id].players[query.player_no-1];
        let game = rooms[query.room_id].game;
        let game_win = false;
        let current_player = game[player_id];
        current_player.score = current_player.score + dice_val;
        if(current_player.score >= 10) {
            current_player.win = true;
            game_win = true;
            rooms[query.room_id].status = 'complete';
            rooms[query.room_id].winning_player = player_id; 
        }
        current_player.turn = false;
        if(!game_win) {
            //set next player turn
            let next_player_id;
            if(query.player_no == rooms[query.room_id].players.length) {
                next_player_id = rooms[query.room_id].players[0];
            } else {
                next_player_id = rooms[query.room_id].players[query.player_no];
            }
            game[next_player_id].turn = true;
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