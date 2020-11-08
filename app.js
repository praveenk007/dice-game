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
            rooms[query.room_id] = {};
            rooms[query.room_id][query.player_id] = {score: 0, 'player_no': 1};
        } else {
            rooms[query.room_id][query.player_id] = {score: 0, 'player_no': Object.keys(rooms[query.room_id]).length+1};
            var game = rooms[query.room_id];
            for(var player_id in game) {
                console.log('starting game '+ player_id)
                io.emit(player_id + '-game-start', game);
            }
        }
        console.log(rooms)
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});