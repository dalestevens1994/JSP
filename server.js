
var	nicknames = [];

//Start the server!!!!
var port = 8080;
//var io = require('/usr/local/lib/node_modules/socket.io').listen(port).sockets;
var io = require('socket.io').listen(port).sockets;


console.log('################################################');
console.log('          Starting Server v.1.0 Beta            ');
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

			//check to make sure you get the nicknames object
			console.log(socket.nickname);

			//run nicknames function
			updateNicknames(socket.nickname);
		}
	});

	var moves = function(){

	}

	var game = function(){
		game.players();
		game.turn();
		game.board();
		game.pieces();

		pieces = {
		'black' : {
					pawn1: 		{'pos' :{'x': 2, 'y':'a'}, 'alive': true}, 
					pawn2: 		{'pos' :{'x': 2, 'y':'b'}, 'alive': true}, 
				   	pawn3: 		{'pos' :{'x': 2, 'y':'c'}, 'alive': true},
				   	pawn4: 		{'pos' :{'x': 2, 'y':'d'}, 'alive': true},
				   	pawn5: 		{'pos' :{'x': 2, 'y':'e'}, 'alive': true},
				   	pawn6: 		{'pos' :{'x': 2, 'y':'f'}, 'alive': true},
				   	pawn7: 		{'pos' :{'x': 2, 'y':'g'}, 'alive': true},
				   	pawn8: 		{'pos' :{'x': 2, 'y':'h'}, 'alive': true},
				   	Castle1: 	{'pos' :{'x': 1, 'y':'a'}, 'alive': true},
					Castle2: 	{'pos' :{'x': 1, 'y':'h'}, 'alive': true},
				   	Knight1: 	{'pos' :{'x': 1, 'y':'b'}, 'alive': true},
				   	Knight2: 	{'pos' :{'x': 1, 'y':'g'}, 'alive': true},
				   	Bishop1: 	{'pos' :{'x': 1, 'y':'c'}, 'alive': true},
				   	Bishop2: 	{'pos' :{'x': 1, 'y':'f'}, 'alive': true},
				   	Queen: 		{'pos' :{'x': 1, 'y':'d'}, 'alive': true},
				   	King: 		{'pos' :{'x': 1, 'y':'e'}, 'alive': true},
				},
		'white' : {
					pawn1: 		{'pos' :{'x': 7, 'y':'a'}, 'alive': true}, 
					pawn2: 		{'pos' :{'x': 7, 'y':'b'}, 'alive': true},
				   	pawn3: 		{'pos' :{'x': 7, 'y':'c'}, 'alive': true},
				   	pawn4: 		{'pos' :{'x': 7, 'y':'d'}, 'alive': true},
				   	pawn5: 		{'pos' :{'x': 7, 'y':'e'}, 'alive': true},
				   	pawn6: 		{'pos' :{'x': 7, 'y':'f'}, 'alive': true},
				   	pawn7: 		{'pos' :{'x': 7, 'y':'g'}, 'alive': true},
				   	pawn8: 		{'pos' :{'x': 7, 'y':'h'}, 'alive': true},
				   	Castle1: 	{'pos' :{'x': 8, 'y':'a'}, 'alive': true},
					Castle2: 	{'pos' :{'x': 8, 'y':'h'}, 'alive': true},
				   	Knight1: 	{'pos' :{'x': 8, 'y':'b'}, 'alive': true},
				   	Knight2: 	{'pos' :{'x': 8, 'y':'g'}, 'alive': true},
				   	Bishop1: 	{'pos' :{'x': 8, 'y':'c'}, 'alive': true},
				   	Bishop2: 	{'pos' :{'x': 8, 'y':'f'}, 'alive': true},
				   	Queen: 		{'pos' :{'x': 8, 'y':'d'}, 'alive': true},
				   	King: 		{'pos' :{'x': 8, 'y':'e'}, 'alive': true},
				},
		}
	}
	
	//pass the nickname from the client and store nickname into the nicknames array
	function updateNicknames(nickname){
		if (nicknames.length == 0){
			nicknames.push(nickname);
			//players[0] = nicknames;
			players[0] = 'white';
			console.info(nicknames);
		} else if (nicknames.length == 1) {

		}
		io.emit('usernames', nicknames);
	}

	socket.on('send_message', function(data){
		io.emit('new_message', {msg: data, nick: socket.nickname});
	});
	
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	});
});