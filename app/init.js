var socket = io.connect('http://127.0.0.1:8080');
var nickError = '#nickError';
var nickBox = '#nickname';
var users = '#users';
var messageForm = '#send-message';
var messageBox = '#message';
var chat = '#chat';

var click_count = 0;
var start_pos = null;
var end_pos = null;
var name = null;
var test_data = null;


//tempory piece storage
var start_peice_id = null;
var peice_img = null;
var end_peice_id = null;

 
function chat_message(nick, msg){
    $(chat).append('<b>' + nick + ': </b>' + msg + "<br/>");
}

function console_message(msg){
    $(chat).append('<span style="border: 1px solid red; padding: 5px;"><b>Console: </b>' + msg + "</span><br/>");
}

$(document).ready(function(){
    console_message('Loading game...');

    $('#setNick').click(function(){
        console_message('Setting Nick To' + $(nickBox).val());
        name = $(nickBox).val();
        socket.emit('user', $(nickBox).val(), function(data){
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

    $('#board td').click(function(){
        console_message('you have clicked on ' + $(this).attr('data-pos-x') + $(this).attr('data-pos-y'));

        if(click_count != 2){

            if(click_count == 0) {
                peice_img = $(this).children('img').attr('src');
                start_peice_id = $(this).attr('id');
                start_pos = {
                    'x': $(this).attr('data-pos-x'),
                    'y': $(this).attr('data-pos-y')
                }
            }

            if(click_count == 1) {
                end_peice_id = $(this).attr('id');
                end_pos = {
                    'x': $(this).attr('data-pos-x'),
                    'y': $(this).attr('data-pos-y')
                }
            }

            $(this).css({'border': '3px solid blue'});
            click_count++;  

            if(click_count == 2){
                //set positions from x,y to x,y piece and player.
                move = {
                    'from' :    {'x':start_pos.x, 'y':start_pos.y},
                    'to' :      {'x':end_pos.x, 'y':end_pos.y},
                    'player' :  name,
                    'peice_img': peice_img,
                    'start_peice_id' : start_peice_id,
                    'end_peice_id' : end_peice_id

                }
                socket.emit('Move', move);
                //clear move
                start_pos = null;
                end_pos = null;
            }

        } else {
           
        }
    });

    socket.on('usernames', function(data){
        var html = '';
        for(i=0; i < data.length; i++){
            html += data[i] + '<br/>'
        }
        $(users).html(html);
    });

    socket.on('new_message', function(data){
        chat_message(data.nick, data.msg)
    });

    socket.on('init', function(data){
        test_data = data;
        console.log(test_data);
        var message = 'Welcome, Game is now starting. ' + data.player1.nick + ' is ' + data.player1.colour +  ' and ' + data.player2.nick + ' is ' + data.player2.colour + ', White player goes firdt. GLHF FIGHT!!!.';
        console_message(message);
    });

    socket.on('move_confirmation', function(data){
        if(data.confirm == true){
           console.log('got move confirmation');
            $('#board td').removeAttr('style');
            click_count = 0;
            console_message('move accepted'); 

            console.log('start peices id = ' + data.start_peice_id);
            console.log('img = ' + data.peice_img);
            console.log('end peice id = ' + data.end_peice_id);

            $('#' + data.start_peice_id).empty();
            $('#' + data.end_peice_id).empty();
            $('#' + data.end_peice_id).append('<img src="' + data.peice_img + '">');   
        }
    });
});


