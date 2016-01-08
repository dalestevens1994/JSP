var socket = io.connect('http://127.0.0.1:8080');
var nickError = '#nickError';
var nickBox = '#nickname';
var users = '#users';
var messageForm = '#send-message';
var messageBox = '#message';
var chat = '#chat';
            
$(document).ready(function(){
    console.log('loading app');

    $('#setNick').click(function(){
        console.log('form submited');
        socket.emit('new_user', $(nickBox).val(), function(data){
            console.log('sending user name');
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else{
                $(nickError).html('That username is already taken!  Try again.');
            }
        });
        $(nickBox).val('');
    });

    $(messageForm).submit(function(e){
        e.preventDefault();
        socket.emit('send_message', $(messageBox).val());
        $(messageBox).val('');
    });

    socket.on('usernames', function(data){
        var html = '';
        for(i=0; i < data.length; i++){
            html += data[i] + '<br/>'
        }
        $(users).html(html);
    });

    socket.on('new_message', function(data){
        $(chat).append('<b>' + data.nick + ': </b>' + data.msg + "<br/>");
    });
});
