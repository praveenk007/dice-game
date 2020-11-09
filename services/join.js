var rooms = require('./inMemory.js');

class Join {

    processEvent(query) {
        if(!rooms[query.room_id]) {
            rooms[query.room_id] = {
                players: [query.player_id],
                game: {},
                status: 'created'
            };
            rooms[query.room_id].game[query.player_id] = {score: 0, 'turn': true, 'win': false};
        } else {
            rooms[query.room_id].players.push(query.player_id);
            rooms[query.room_id].game[query.player_id] = {score: 0, 'turn': false, 'win': false};
            var game = rooms[query.room_id].game;
            rooms[query.room_id].status = 'in_progress';
        } 
        console.log('in join ' + JSON.stringify(rooms))

        this.result = rooms[query.room_id]
    }

    set game(r) {
        this.result = r;
    }

    get game() {
        return this.result;
    }
}

module.exports = Join