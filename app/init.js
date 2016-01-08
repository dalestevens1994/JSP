var socket = io.connect('http://127.0.0.1:8080');
var $nickForm = $('#setNick');
var $nickError = $('#nickError');
var $nickBox = $('#nickname');
var $users = $('#users');
var $messageForm = $('#send-message');
var $messageBox = $('#message');
var $chat = $('#chat');
            
$(document).ready(function(){
    console.log('loading');

    $nickForm.submit(function(e){
        e.preventDefault();
        socket.emit('new user', $nickBox.val(), function(data){
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else{
                $nickError.html('That username is already taken!  Try again.');
            }
        });
        $nickBox.val('');
    });

    $messageForm.submit(function(e){
        e.preventDefault();
        socket.emit('send message', $messageBox.val());
        $messageBox.val('');
    });

    socket.on('usernames', function(data){
        var html = '';
        for(i=0; i < data.length; i++){
            html += data[i] + '<br/>'
        }
        $users.html(html);
    });

    socket.on('new message', function(data){
        $chat.append('<b>' + data.nick + ': </b>' + data.msg + "<br/>");
    });
});
