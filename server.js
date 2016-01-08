
var	nicknames = [];

//Start the server!!!!
var port = 8080;
//var io = require('/usr/local/lib/node_modules/socket.io').listen(port).sockets;
var io = require('socket.io').listen(port).sockets;


console.log('################################################');
console.log('          Starting Server v.1.1.0 Beta          ');
console.log('     Accepting connections on port : ' + port    );
console.log('################################################');

// app.get('/', function(req, res){
// 	res.sendfile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
	console.log('new connection');
	socket.on('new_user', function(data, callback){
		console.log('new_user');
		if (nicknames.indexOf(data) != -1){
			callback(false);
		} else{
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateNicknames();
		}
	});
	
	function updateNicknames(){
		io.sockets.emit('usernames', nicknames);
	}

	socket.on('send_message', function(data){
		io.sockets.emit('new_message', {msg: data, nick: socket.nickname});
	});
	
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});
});