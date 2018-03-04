<!--Client-->
alert('loaded');
var socket = io.connect('localhost:8000');

$('#submit-btn').on('click', function(e) {
    socket.emit('letter', function(data) {
        socket.send('letter');
    });
};
