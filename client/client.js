let socket = io ();

let chatBox = document.getElementById('chatBox');
let chatInput = document.getElementById('chatInput');
let chatForm = document.getElementById('chatForm');


function message (msg) {
    socket.emit ('message', {
        message: msg
    });
}

socket.on ('writeToChatBox', (msg) => {
    chatBox.innerHTML = '<div class="text">' + msg + '</div>' + chatBox.innerHTML;
})

chatForm.onsubmit = (e) => {
    e.preventDefault ();
    message (chatInput.value);
    chatInput.value = '';
}



const ctx = document.getElementById ('canvas').getContext ('2d');
ctx.font = '30px Arial';

socket.on('broadcast', (msg) => {
    alert(msg);
})

socket.on('update', (data) => {
    ctx.clearRect (0,0,600,600);
    ctx.fillStyle = 'white';
    for (var i = 0; i < data.length; i++) {
        ctx.fillText (data[i].id, data[i].x, data[i].y);
    }
});

let inputs = {'w': false, 'd': false, 's': false, 'a':false};

document.onkeydown = (evt) => {
    for (let i in inputs) {
        if (evt.key.toLowerCase() == i) {
            socket.emit('key', {input: i, state: true});
        }
    }
}

document.onkeyup = (evt) => {
    for (let i in inputs) {
        if (evt.key.toLowerCase() == i) {
            socket.emit ('key', {input: i, state: false});
        }
    }
}