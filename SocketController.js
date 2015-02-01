
var keyStore={
};
function saveCookie(val){
	document.cookie=JSON.stringify(val);
}
$(document).ready(function(){
	try{
	keyStore=JSON.parse(document.cookie);
	console.log(keyStore);
}
	catch(err){
		console.log("error in importing cookie");
	}
});
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
				saveCookie(keyStore);
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