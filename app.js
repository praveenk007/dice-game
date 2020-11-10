var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var socketConstants = require('./constants/socketConstants')
const config = require('config');

const EventHandler = require('./services/eventHandler.js');
const Join = require('./services/join.js');
const Roll = require('./services/roll.js');
const GameState = require('./services/gameState.js');


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', (socket) => {
    
    socket.on(socketConstants.JOIN, (query) => {
        let handler = new EventHandler(new Join());
        handler.processEvent(query);
        let game = handler.result;
        game.players.forEach(player_id => {
            io.emit(player_id + socketConstants.GAME_START_SUFFIX, game);
        });
        if(game.status == 'in_progress') {
            beginCountdown(query.room_id, query.player_id);
        }
    });

    function beginCountdown(room_id, player_id) {
        let counter = config.get('game.auto_play_timer');
        let countdownInterval = setInterval(function() {
            let game = new GameState().game(room_id);
            if(game.player_turn != player_id || game.winner) {
                clearInterval(countdownInterval);
            } else if(counter == 0) {
                let player_no = game.players.findIndex(pl_id => pl_id == player_id) + 1;
                io.emit(socketConstants.ROLL_RESULT, roll({'player_no': player_no, 'room_id': room_id}));
                clearInterval(countdownInterval);
            } else {
                let player_no = game.players.findIndex(pl_id => pl_id == player_id) + 1;
                io.emit(room_id + socketConstants.TIMER_SUFFIX, {val: counter, player_no: player_no, player_id: player_id});
                counter--;
            }
        }, 1000);
    }

    socket.on(socketConstants.ROLL, (query) => {
        io.emit(socketConstants.ROLL_RESULT, roll(query));
    });

    function roll(query) {
        let handler = new EventHandler(new Roll());
        handler.processEvent(query);
        let result = handler.result;
        beginCountdown(query.room_id, result.player_turn);
        return result;
    }
});
let port = config.get('app.port');
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});