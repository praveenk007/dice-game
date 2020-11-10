var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const EventHandler = require('./services/eventHandler.js');
const Join = require('./services/join.js');
const Roll = require('./services/roll.js');
const GameState = require('./services/gameState.js');


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', (socket) => {
    
    socket.on('join', (query) => {
        let handler = new EventHandler(new Join());
        handler.processEvent(query);
        let game = handler.result;
        game.players.forEach(player_id => {
            io.emit(player_id + '-game-start', game);
        });
        if(game.status == 'in_progress') {
            let counter = 10;
            let countdownInterval = setInterval(function() {
                console.log(counter);
                let game = new GameState().game(query.room_id);
                if(game.player_turn != query.player_id) {
                    clearInterval(countdownInterval);
                } else if(counter == 0) {
                    let player_no = game.players.findIndex(pl_id => pl_id == query.player_id) + 1;
                    io.emit('roll-result', roll({'player_no': player_no, 'room_id': query.room_id}));
                    clearInterval(countdownInterval);
                } else {
                    io.emit(query.room_id + '-timer', counter);
                    counter--;
                }
            }, 1000);
        }
    });
    socket.on('roll', (query) => {
        io.emit('roll-result', roll(query));
    });

    function roll(query) {
        let handler = new EventHandler(new Roll());
        handler.processEvent(query);
        return handler.result;
    }
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});