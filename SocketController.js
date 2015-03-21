var keyStore={
	//keyStore is the object that stores all of the data
}


var showLogs=false;
function logConsole(message){
	if(showLogs==true){
	console.log(message);}
}
RegExp.escape = function(text) {
	if (!arguments.callee.sRE) {
		var specials = [
			'/', '.', '*', '+', '?', '|',
			'(', ')', '[', ']', '{', '}', '\\'
		];
		arguments.callee.sRE = new RegExp(
			'(\\' + specials.join('|\\') + ')', 'g'
		);
	}
	return text.replace(arguments.callee.sRE, '\\$1');
}
RegExp.unescape=function(text){
	return text.replace(/\\/g,"")
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
	var writeVal;
	if((typeof id)=="string"){

			id=RegExp.escape(id);
			//while(true){
				var nextIndex=id.indexOf('|');
				if(nextIndex==-1){
					//id=id.subString(nextIndex);
					keyStore[id]=value;
				}
				else{
					keyStore[id]=value;
				}
			//}
	}
	//try{
	var $obj=$("#"+id);
	$obj.text(value);
	$obj.val(value);
	/*}
	catch(err){
		console.log(id+" is not synced with a key");
	}*/
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
						//keyStore["selected"]=keyStore["default"];
					}
					socket.onmessage = function(msg) {
						var data = JSON.parse(msg.data);
						var value = data['value'];
						var key = data['key'];
						var Event = data['event'];

						logConsole(key+" "+Event+" "+value);



						logConsole(key+" "+Event+" "+value);
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
		setValue:function(val,doEscape){//val is a json object,

			if((typeof val.key)=="string" && doEscape==true){/*
			val.key=val.key.replace("~","|");
			key=key.replace("?",/ /g);*/
			//val.key=unescape(val.key);
			val.key=RegExp.unescape(val.key);
		}
			this.sendMessage(JSON.stringify(val));
		},
		setKeyValue:function(key,value,Event,addExtendedPath){
			//if addExtended path ==true, add escaped(smartDashboard) to key

				if((typeof key)=="string"){
					/*
						key=key.replace("~","|");
						key=key.replace("?",/ /g);*/
						//val.key=unescape(val.key);
						key=RegExp.unescape(key);
						try{
						if( typeof(addExtendedPath)=='string'){
							key=addExtendedPath+key;
						}
						else if(addExtendedPath==true){
								key='/SmartDashboard/'+key;
						}
					}
					catch(err){
						console.log('no extendedPath, is ok');
					}
				}
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
