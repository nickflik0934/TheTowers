
let Entity = require('./entity.js');

class Player extends Entity {

    constructor (x, y, id) {
        super(x, y, id);
        this.input = {'w': 
            {
                active: false, 
                action: (deltaTime) => {this.move(0, -1, deltaTime)}
            }, 
            'd': {
                active: false, 
                action: (deltaTime) => {this.move(1, 0, deltaTime)}
            },
            's': {
                active: false, 
                action: (deltaTime) => {this.move(0, 1, deltaTime)}
            }, 
            'a':{
                active: false, 
                action: (deltaTime) => {this.move(-1, 0, deltaTime)}
            }
        };

        this.maxSpeed = 60;
        Player.list [id] = this;
    }

    update (deltaTime) {
        for (var i in this.input) {
            let button = this.input[i];
            if (button.active) {
                button.action(deltaTime);
            }
        }
    }

    move (x, y, deltaTime) {
        this.x = this.x + x * deltaTime * this.maxSpeed;
        this.y = this.y + y * deltaTime * this.maxSpeed;
    }
}

Player.list = {};

Player.connect = (socket, id) => {
    let player = new Player (200, 200, id);

    socket.on ('key', (data) => {
        player.input [data.input].active = data.state;
    });
}

Player.update = (deltaTime) => {
    let packets = [];

    for (var i in Player.list) {
        Player.list [i].update (deltaTime);
    }

    for (var i in Player.list) {
        var player = Player.list [i];
        packets.push (
            {
                id: player.id,
                x: player.x,
                y: player.y
            }
        );
    }

    return packets;
}

Player.disconnect = (id) => {
    delete Player.list [id];
}

module.exports.connect = Player.connect;
module.exports.disconnect = Player.disconnect;
module.exports.update = Player.update;
