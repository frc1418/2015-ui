var test = "none";

var keyStore={
}



jQuery(function($) {


	var socket;
	if (!("WebSocket" in window)) {
		alert("Your browser does not support web sockets");
	}

	else {
		setup();
	}


	function getValue(key) {
		//checks keyStore for val of key
		return keyStore[key];
	}


	function setValue(val) {
		//val is a json string
		socket.send(val);
	}


	function setKeyValue(key,value) {
		//key and value are strings
		var val={
			"key":key,
			"value":value
		}

		socket.send(JSON.stringify(val));
	}

	function setup() {

		console.log(test);
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

				var val=JSON.stringify(keyStore["Local"]);
				localStorage.setItem("Local", val);	//write things within keystore, Local to localStoreage
			}

			socket.onclose = function() {

				console.log("Socket Closed");
				setTimeout(function(){ setup(); }, 300);

			}

		}
		else {
			console.log("invalid socket");
		}



	}









});
