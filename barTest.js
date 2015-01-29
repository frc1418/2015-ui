
var keyStore={

	"largeSensorValue":0,
	"shortSensorValue":0,
	"largeSensorValue2":0,
	"shortSensorValue2":0
};
var keyVals={
	0:"largeSensorValue",
	1:"shortSensorValue",
	2:"largeSensorValue2",
	3:"shortSensorValue2"
}
function draw(data) {
    var scale = d3.scale.linear()
        .domain([0, 200])
        .range([0, 100]);

    var bars = d3.select("#barchart")
        .selectAll("div")
        .attr("id","barchart")
        .attr("title",function(d,i){return keyVals[i];})
        .data(data);
     
    // enter selection
    bars
        .enter().append("div");

    // update selection
    bars
        .style("width", function (d) {return scale(d) + "%";})
        .text(function (d) {return d;});
    
    // exit selection
    bars
        .exit().remove();
};

window.onload = draw([0, 0, 0, 0]);

jQuery(function($) {
	if (!("WebSocket" in window)) {
		alert("Your browser does not support web sockets");
	} else {

		setup();
	}
	function setup() {
		console.log("setup Called");
		var host = "ws://localhost:8888/ws";
		var socket = new WebSocket(host);

		var vals = [0, 0, 0, 0]
		
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
					vals[0] = keyStore['largeSensorValue'];
					vals[1] = keyStore['shortSensorValue'];
					
					vals[2] = keyStore['largeSensorValue2'];
					vals[3] = keyStore['shortSensorValue2'];
				
				
				console.log(vals, data);
				draw(vals);
			}
			socket.onclose = function() {
				console.log("socket Closed");
				setTimeout(function(){
				    setup();
				}, 2000);
			}

		} else {
			console.log("invalid socket");
		}
	}
});



