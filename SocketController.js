var keyStore={
	//keyStore is the object that stores all of the data
}


var showLogs=false;
function logConsole(message){
	if(showLogs==true){
	console.log(message);}

}
waitForSocketConnection=function(sock,callback){
	//Callback to make sure it waits for finished connection before it sends messages
	setTimeout(
				function(){
						if (sock.readyState === 1) {
								if(callback !== undefined){
										callback();
								}
								return;
						} else {
					waitForSocketConnection(sock,callback);
						}
				}, 5);
}
var socket;
var Socket={
								//the socket object
	setup:function (){
				logConsole("setup Called");
				var host = "ws://localhost:8888/ws";
				socket = new WebSocket(host);
				if (socket) {
					socket.onopen = function() {
						logConsole("keystore is",keyStore);
					}
					socket.onmessage = function(msg) {
						var data = JSON.parse(msg.data);
						var valueString = data['value'];				//value is a json String//is very important
						var key = data['key'];
						var event = data['event'];

						var value=JSON.parse(valueString);			//parsed jsonString
						keyStore[key]=value;


						logConsole("Message Recieved-key"+key+"-"+value);
						if(event=="Local"){
						var val=keyStore["Local"];
						val[key]=value;
						keyStore.Local=val;
						localStorage.setItem("Local", JSON.stringify(val));	//re recording anything in local
						}
					}
					socket.onclose = function() {
						logConsole("Socket Closed");
						setTimeout(function(){
								Socket.setup();
						}, 300);
					}

				} else {
					logConsole("invalid socket");
				}
			},

			getValue:function(key){
				//checks keyStore for val of key
				return keyStore[key];
			},

			sendMessage:function(msg) {//accepts a json strings
				waitForSocketConnection(socket, function() {
						socket.send(msg);
				});
		},
		setValue:function(val){//val is a json object,
			this.sendMessage(JSON.stringify(val));
		},
		setKeyValue:function(key,value,Event){//key,event, and value are strings,
			var val={
				"key":key,
				"value":value,
				"action":Event
			}
			this.sendMessage(JSON.stringify(val));
		}
}
jQuery(function($) {
	if (!("WebSocket" in window)) {
		alert("Your browser does not support web sockets");
	} else {

		Socket.setup();
	}

});
