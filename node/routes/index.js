// server
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8001);

io.sockets.on('connection', function (socket) {

	// 更新通知処理
	socket.on('notify', function(data){
		console.log(data);

		var now = new Date();
		data.updated =  now.toLocaleString();

		io.sockets.emit('files', data);
	});

});


// client
var client = require('socket.io-client');
var csocket = client.connect('http://example.com:8001');

exports.index = function(req, res){

	// get parameter
	var host = '';
	var path = req.query.path;
	var remoteIP = req.connection.remoteAddress;

	require('dns').reverse(remoteIP, function(err, domain){
		if(err || ! domain){
			host = remoteIP;
		}
		else {
			host = domain[0];
		}

		if(host && path){
			console.log(remoteIP + ":" + path);
			csocket.emit('notify', {host: host, path: path});
		}
	});

	res.render('index', { title: 'Express' });
};

