
//The game details object
function game (){
}
game.prototype.players = [];
game.prototype.startGame = false;
game.prototype.turn = null;
//object containing 2 arrays filled with JSON objects. {} = JSON object. [] = array
game.prototype.pieces = {
	'black' : [
				{'piece' : 'pawn1', 'pos' :{'x': 2, 'y':'a'}, 'alive': true}, 
				{'piece' : 'pawn2', 'pos' :{'x': 2, 'y':'b'}, 'alive': true}, 
			   	{'piece' : 'pawn3', 'pos' :{'x': 2, 'y':'c'}, 'alive': true},
			   	{'piece' : 'pawn4', 'pos' :{'x': 2, 'y':'d'}, 'alive': true},
			   	{'piece' : 'pawn5', 'pos' :{'x': 2, 'y':'e'}, 'alive': true},
			   	{'piece' : 'pawn6', 'pos' :{'x': 2, 'y':'f'}, 'alive': true},
			   	{'piece' : 'pawn7', 'pos' :{'x': 2, 'y':'g'}, 'alive': true},
			   	{'piece' : 'pawn8', 'pos' :{'x': 2, 'y':'h'}, 'alive': true},
			   	{'piece' : 'Castle1','pos' :{'x': 1, 'y':'a'}, 'alive': true},
				{'piece' : 'Castle2', 'pos' :{'x': 1, 'y':'h'}, 'alive': true},
			   	{'piece' : 'Knight1', 'pos' :{'x': 1, 'y':'b'}, 'alive': true},
			   	{'piece' : 'Knight2', 'pos' :{'x': 1, 'y':'g'}, 'alive': true},
			   	{'piece' : 'Bishop1', 'pos' :{'x': 1, 'y':'c'}, 'alive': true},
			   	{'piece' : 'Bishop2', 'pos' :{'x': 1, 'y':'f'}, 'alive': true},
			   	{'piece' : 'Queen',	'pos' :{'x': 1, 'y':'d'}, 'alive': true},
			   	{'piece' : 'King', 	'pos' :{'x': 1, 'y':'e'}, 'alive': true}
			],
	'white' : [
				{'piece' : 'pawn1', 'pos' :{'x': 7, 'y':'a'}, 'alive': true}, 
				{'piece' : 'pawn2', 'pos' :{'x': 7, 'y':'b'}, 'alive': true},
			   	{'piece' : 'pawn3', 'pos' :{'x': 7, 'y':'c'}, 'alive': true},
			   	{'piece' : 'pawn4', 'pos' :{'x': 7, 'y':'d'}, 'alive': true},
			   	{'piece' : 'pawn5', 'pos' :{'x': 7, 'y':'e'}, 'alive': true},
			   	{'piece' : 'pawn6', 'pos' :{'x': 7, 'y':'f'}, 'alive': true},
			   	{'piece' : 'pawn7', 'pos' :{'x': 7, 'y':'g'}, 'alive': true},
			   	{'piece' : 'pawn8', 'pos' :{'x': 7, 'y':'h'}, 'alive': true},
			   	{'piece' : 'Castle1', 'pos' :{'x': 8, 'y':'a'}, 'alive': true},
				{'piece' : 'Castle2', 'pos' :{'x': 8, 'y':'h'}, 'alive': true},
			   	{'piece' : 'Knight1', 'pos' :{'x': 8, 'y':'b'}, 'alive': true},
			   	{'piece' : 'Knight2', 'pos' :{'x': 8, 'y':'g'}, 'alive': true},
			   	{'piece' : 'Bishop1', 'pos' :{'x': 8, 'y':'c'}, 'alive': true},
			   	{'piece' :  'Bishop2', 'pos' :{'x': 8, 'y':'f'}, 'alive': true},
			   	{'piece' : 'Queen', 'pos' :{'x': 8, 'y':'d'}, 'alive': true},
			   	{'piece' : 'King', 'pos' :{'x': 8, 'y':'e'}, 'alive': true}
			],
	};
	
game.prototype.setNicknames = function(nickname){
	var state = null;
	if (this.players.length == 0){
		this.players[0] = {'nick': nickname, 'colour': 'white'};
		state = false;
	} else if (this.players.length == 1) {
		this.players[1] = {'nick': nickname, 'colour': 'black'};
		state = true;
	} else {
		this.players.push({'nick':nickname, 'colour': null});
	}
	console.info(this.players);	
	return state;	
}

//Game rules object
function rules(){
}
rules.prototype.check_move = function(){
	console.log('checking valid move');
	return true;
}

//Communications object
function communications(){
};
communications.prototype.currentPlayers = function(players){
	io.emit('usernames', players);
};
communications.prototype.gameInitialisation = function(players){
	io.emit('init', players);
};
communications.prototype.turn = function(){
	io.emit('turn', "hello");
};
communications.prototype.win = function(){
	io.emit('win', "player white wins");
};


//Start the server!
var port = 8080;
var io = require('socket.io').listen(port).sockets;
//var io = require('/usr/local/lib/node_modules/socket.io').listen(port).sockets;

console.log('################################################');
console.log('          Starting Server v.1.0 Beta            ');
console.log('     Accepting connections on port : ' + port    );
console.log('################################################');

var current_game = new game();
var communication = new communications();
var check_moves = new rules();



io.on('connection', function(socket){

	socket.on('user', function(data, callback){
		console.log('new_user');
		callback(true);

		//run nicknames function
		current_game.startGame = current_game.setNicknames(data);
		if(current_game.startGame === true){
			var players = {'player1' : current_game.players[0], 'player2' : current_game.players[1]};
			current_game.turn = current_game.players[0].nick;
			communication.gameInitialisation(players);
		}
		console.info(data);
	});

	socket.on('Move', function(data, callback){
		console.log('check ' + data.player + ' = ' + current_game.turn);

		if (data.player == current_game.turn){
			console.log('is players turn');
			console.log(current_game.players);
			//check players colour
			for (i = 0; i < current_game.players.length; ++i){
				console.log('current loop number ' + i);
				var p = current_game.players[i];
				if (p.nick == data.player){
					var player_number = i;
					var c = p.colour;

					console.log('player number = ' + player_number + 'colour = ' + c);
				}
			}

			//loop through pieces if piece x and y = x and y and get the piece being moved
			console.log('loop number two: ' + c);
			console.log(current_game.pieces[c]);
			for(i = 0; i < 16; ++i){
				var piece = current_game.pieces[c][i];
				console.log(piece);
				//check alive
				if (piece.pos.x == data.from.x && piece.pos.y == data.from.y && piece.alive == true){
					console.log('found piece ' + piece);
					//check valid move
					valid = check_moves.check_move();
					//update position
					if(valid == true){
						piece.position.y == data.to.y;
						piece.position.x == data.to.x;

						console.log('set update position of piece');
					}

				}
			}

			//remove any taken pieces
			for(i = 0; i < 16; ++i){
				console.log('found piece to take');
				var piece = current_game.pieces[c][i];
				if (piece.pos.x == data.to.x && piece.pos.y == data.to.y && piece.alive == true){
					piece.alive == false;

					console.log('killed piece');
				}
			}


			//check for check / checkmate

			//send move confirmation
			confirmation = {
					'confirm': true,
				    'piece_img': data.piece_img,
                    'start_piece_id' : data.start_piece_id,
                    'end_piece_id' : data.end_piece_id
			}

			io.emit('move_confirmation', confirmation);
			console.log('emit move confirmation');
			//swap turns
			if(player_number == 0){
				console.log('set players turn to player 1');
				//set player to player 1
				current_game.turn = current_game.players[1].nick;
			} else {
				console.log('set players turn to player 0');
				//set player to player 0
				current_game.turn = current_game.players[0].nick;
			}

		} else {
			// send a socket on the one it came in on
		}
	});

	socket.on('message', function(data,callback){
		io.emit('new_message', {msg: data, nick: 'test'});
	});

	
});
