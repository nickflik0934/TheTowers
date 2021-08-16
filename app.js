
const express = require ('express');
const app = express ();
const server = require ('http').Server (app);
const Player = require ('./player.js');

app.get ('/', (req, res) => {
    res.sendFile (__dirname + '/client/index.html');
    //res.sendFile (__dirname + '/client/style.css');
});
app.use ('/client', express.static (__dirname + '/client'));

server.listen (666);
console.log ('Server started');



const SOCKETS = {};

var io = require ('socket.io') (server, {});
io.sockets.on ('connection', (socket) => {
    console.log ('A player has joined the game.');
    let id = Math.random ();
    SOCKETS[id] = socket;
    let playerName = id;

    Player.connect (socket, id);

    socket.on ('disconnect', () => {
        console.log ('A player has left the game.');
        delete SOCKETS[id];
        Player.disconnect (id);
    });
    
    broadcast = (msg) => {
        socket.emit('broadcast', msg);
    }

    socket.on('message', (data) => {
        if (data.message.charAt(0) == '/') {
            let data = 'Invalid command.';
            try {
                data = eval(data.message.slice(1, data.message.length))
            } catch (e) {
                
            }
            for(let i in SOCKETS) {
                SOCKETS[i].emit('writeToChatBox', data);
            }
        } else {
            for(let i in SOCKETS) {
                SOCKETS[i].emit('writeToChatBox', playerName + ': ' + data.message);
            }
        }
    })
});

let time = new Date ();
let lastTime = time.getTime ();
setInterval (() => {
    let time = new Date ();
    let deltaTime = (time.getTime () - lastTime) / 1000;
    lastTime = time.getTime ();

    let packets = Player.update (deltaTime);

    for (var i in SOCKETS) {
        var socket = SOCKETS[i];
        socket.emit ('update', packets);
    }
}, 1000/60);
