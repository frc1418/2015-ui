
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

function setKeyStore(id,value){
	keyStore[id]=value;
	var $obj=$("#"+id);
	$obj.text(value+"");
	$obj.val(value);
}

changeText =function (obj,val){
	console.log("CHANGETEXT");
	obj.text(val);
}
changeValue =function (obj,val){
	console.log("CHANGEVALUE");

	obj.val(val);
}


var Socket={
								//the socket object
	setup:function (){
				logConsole("setup Called");
				var host = "ws://localhost:8888/ws";
				socket = new WebSocket(host);
				if (socket) {
					socket.onopen = function() {
					 console.log("keystore is",keyStore);
					}
					socket.onmessage = function(msg) {
						var data = JSON.parse(msg.data);
						var value = data['value'];
						var key = data['key'];
						var Event = data['event'];


						//changeRecieved(key,value);
						logConsole("Message Recieved-key"+key+"-"+value);

						console.log(key+" "+Event+" "+value);
						if(Event=="valueChanged"){
							setKeyStore(key,value);

							//whenever a value is recieved it should update the corresponding html element
							//html elements attributes to be altered are generally .text or .value
						}
						else if(Event=="Local"){
							var val=keyStore["Local"];
							val[key]=value;											//no longer stores in keyStore
							localStorage.setItem("Local", val);	//re recording anything in local
						}
						else if(Event=='subtableValueChanged'){
							console.log("subtable value changed, ",key," to ",value);
							setKeyStore(key,value);

								//is the same as value changed for the time being. will probably be changed
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

<<<<<<< HEAD


=======
>>>>>>> FETCH_HEAD
jQuery(function($) {



	var socket;
	if (!("WebSocket" in window)) {
		alert("Your browser does not support web sockets");
<<<<<<< HEAD
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

=======
	} else {
		Socket.setup();
>>>>>>> FETCH_HEAD
	}

});
