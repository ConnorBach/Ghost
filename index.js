var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//setup dictionary
var fs = require('fs');
var dict = JSON.parse(fs.readFileSync('dict.json', 'utf8'));
var curWord = "GHOST";
var players = [];
var turn = 0;
var curTurn = 0;

//1 minute per turn
var WAIT = 60000;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/user/index.html');
});

app.get('/js/client.js', function(req, res){
    res.sendFile(__dirname + '/user/js/client.js')
});

function next_turn() {
    turn = curTurn++ % players.length;
    players[turn].emit('your_turn');
    console.log("next turn triggered " , turn);
    triggerTimeOut();
}

function triggerTimeOut() {
    timeOut = setTimeout(() => {
        next_turn();
    }, WAIT);
}

function resetTimeOut() {
    if(typeof timeOut == 'object') {
        console.log("timeout reset");
        clearTimeout(timeOut);
    }
}

io.on('connection', function(socket) {
    console.log('User connected');

    //add player to player list
    players.push(socket);

    //current socket turn
    socket.on('pass_turn', function() {
        console.log('Current Turn ' + curTurn);
        if(players[turn] == socket) {
            resetTimeOut();
            next_turn();
        }
    });

    //send current word to new user
    io.sockets.emit('sendLetter', curWord + ' ' + dict[curWord]);
    io.sockets.emit('updateCount', players.length);

    socket.on('disconnect', function() {
        console.log('User disconnected');
        players.splice(players.indexOf(socket), 1);
        --turn;
        io.sockets.emit('updateCount', players.length);
        console.log("A number of players now ",players.length);
    });

    //send word and definition back
    socket.on('letter', function(data) {
        curWord = data;
        io.sockets.emit('sendLetter', data + ' ' + dict[data]);
        console.log(curTurn);
    });

    socket.on('challenge', function(data) {
        console.log(data);
    });
});

http.listen(8000, function() {
    console.log('listening on 8000');
});
