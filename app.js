var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join', (query) => {
        if(!rooms[query.room_id]) {
            rooms[query.room_id] = {
                players: [query.player_id],
                game: {}
            };
            rooms[query.room_id].game[query.player_id] = {score: 0, 'player_no': 1, 'turn': true, 'win': false};
        } else {
            rooms[query.room_id].players.push(query.player_id);
            rooms[query.room_id].game[query.player_id] = {score: 0, 'player_no': rooms[query.room_id].players.length, 'turn': false, 'win': false};
            var game = rooms[query.room_id].game;
            for(var player_id in game) {
                console.log('starting game '+ player_id)
                io.emit(player_id + '-game-start', game);
            }
        }
        console.log(rooms)
    });
    socket.on('roll', (query) => {
        let dice_val = Math.floor(Math.random() * Math.floor(5)) + 1;
        let player_id = rooms[query.room_id].players[query.player_no-1];
        let game = rooms[query.room_id].game;
        let game_win = false;
        let current_player = game[player_id];
        current_player.score = current_player.score + dice_val;
        if(current_player.score >= 61) {
            current_player.win = true;
            game_win = true;
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
        console.log(JSON.stringify(rooms));
        io.emit('roll-result', game);
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});