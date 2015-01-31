
var keyStore={
};


jQuery(function($) {
	var socket;
	if (!("WebSocket" in window)) {
		alert("Your browser does not support web sockets");
	} else {
		setup();
	}
	function getValue(key){
		//checks keyStore for val of key
		return keyStore[key];
	}
	function setValue(val){//val is a json
		socket.send(val);
	}
	function setup() {
		console.log("setup Called");
		var host = "ws://localhost:8888/ws";
		socket = new WebSocket(host);

		if (socket) {
			socket.onopen = function() {
			}
			socket.onmessage = function(msg) {
				var data = JSON.parse(msg.data);
				var value = data['value'];
				var key = data['key'];
				var sendTo = "#" + key;
				var event = data['event'];
				keyStore[key]=value;
				
			}
			socket.onclose = function() {
				console.log("socket Closed");
				setTimeout(function(){
				    setup();
				}, 300);
			}

		} else {
			console.log("invalid socket");
		}
	}
});



