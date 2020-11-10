var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var socketConstants = require('./constants/socketConstants')
var gameStatus = require('./constants/gameStatus')
const config = require('config');

const EventHandler = require('./services/eventHandler');
const Join = require('./services/join');
const Roll = require('./services/roll');
const GameState = require('./services/gameState');
const SessionHandler = require('./services/sessionHandler');


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on(socketConstants.CONNECT, (socket) => {
    let session_id = socket.id;
    new SessionHandler().add(session_id, {session_id: session_id, created_at: new Date()});
    socket.on(socketConstants.DISCONNECT, () => {
        new SessionHandler().remove(session_id);
    });
    socket.on(socketConstants.JOIN, (query) => {
        new SessionHandler().update(session_id, {room_id: query.room_id, player_id: query.player_id});
        query.session_id = session_id;
        let handler = new EventHandler(new Join());
        handler.processEvent(query);
        let game = handler.result;
        game.players.forEach(player_id => {
            io.emit(player_id + socketConstants.GAME_START_SUFFIX, game);
        });
        if(game.status == gameStatus.COMMENCED) {
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