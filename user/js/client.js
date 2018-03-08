var socket = io();

$('#submit-btn').on('click', function(e) {
    var msg = $('#userInput').val();
    socket.emit('letter', msg);
    socket.emit('pass_turn');
});

$('#challenge-btn').on('click', function(e) {
    socket.emit('challenge', 'yo');
});

socket.on('sendLetter', function(data) {
    //change html with updated server info
    $('#curWord').text(data);
});

socket.on('updateClients', function(data) {
    $('#users').text('\<li\> ' + data + ' \<\/li\>');
});

socket.on('updateCount', function(data) {
    $('#count').text('Users ' + data);
});