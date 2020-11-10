var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const EventHandler = require('./services/eventHandler.js');
const Join = require('./services/join.js');
const Roll = require('./services/roll.js');


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', (socket) => {
    
    socket.on('join', (query) => {
        let handler = new EventHandler(new Join());
        handler.processEvent(query);
        let game = handler.result;
        //if(game.status == 'in_progress') {
            game.players.forEach(player_id => {
                io.emit(player_id + '-game-start', game);
            });
        //}
    });
    socket.on('roll', (query) => {
        let handler = new EventHandler(new Roll());
        handler.processEvent(query);
        let game = handler.result;
        io.emit('roll-result', game);
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});