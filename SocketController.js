//socketController should handle all of the websocket Code,

var keyStore={
}
var testSettingsObject={
	"names":[1,2,3],
	"values":["a","b","c"]
}
function writeSettings(divName){
	//writes settings UI elements from file, to UI
	var div=d3.select(divName);//at the moment, all of the id's should be ".settingsBox"

/*	THIS SHOULD BE CORRECT, PUT BACK IN WHEN IT CAN WRITE DATA
	var jsonStr=keyStore[document.title+"Vals"];		//get the array of stuff to display, title of document+"Vals"
	//each entity within titleVals should be a JSON object that have arrays for names and values
	var parsedData=JSON.parse(jsonStr);//parsedData is our dataset
*/
	var jsonStr=JSON.stringify(testSettingsObject);//testing, delete when done	
	console.log(jsonStr);
var parsedData=JSON.parse(jsonStr);

	div.selectAll("div")		//selecting all the divs within our div
	.data(parsedData["names"])
	.enter()
	.append("span")
	.text(function(d,i){
		return parsedData["names"][i];
	})
	.append("form")				//appending submitForms for each data
	.append("input")			//appending input forms in the submit forms
	.attr("type","text")
	.attr("value",function(d,i){			//setting values
		return parsedData["values"][i];
	})
	.attr("id",function(d,i){				//setting id's
		return parsedData["names"][i];
	});

}

$(document).ready(function(){

	writeSettings(".settingsBox");
	
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