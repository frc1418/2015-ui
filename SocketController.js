//socketController should handle all of the websocket Code,

var keyStore={
}

function writeSettings(){
	//writes settings UI elements from file, to UI
	var div=$(".settingsBox");
	var vals=keyStore[document.title+"Vals"]		//get the array of stuff to display, title of document+"vals"
}

$(document).ready(function(){
	var retrievedData=localStorage.getItem("keyStore");
	var data=JSON.parse(retrievedData);
	if(data==null){
		console.log("read from localhost == null");
	}
	else{
	keyStore=data;}
	console.log(keyStore);
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
				console.log(keyStore);
			}
			socket.onmessage = function(msg) {
				var data = JSON.parse(msg.data);
				var value = data['value'];
				var key = data['key'];
				var sendTo = "#" + key;
				var event = data['event'];
				keyStore[key]=value;
				console.log("Message Recieved-key"+key+"-"+value);
							
				var val=JSON.stringify(keyStore);
				localStorage.setItem("keyStore", val);
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