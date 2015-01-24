var keyExceptions=new Array();

jQuery(function($){
       if (!("WebSocket" in window)) {
       alert("Your browser does not support web sockets");
       }else{
	   
       setup();
       }
       function setup(){
	   console.log("setup Called");
       var host = "ws://localhost:8888/ws";
       var socket = new WebSocket(host);
	   
       if(socket){
       socket.onopen = function(){
       }
       socket.onmessage = function(msg){
       var data=JSON.parse(msg.data);
       console.log(data);
       var value=data['value'];
       var key=data['key'];
       var sendTo=data['sendTo'];
       var event=data['event'];
       console.log("key-"+key+" is changed to "+value);
	   if(key=='largeSensorValue'|key=="#largeSensorValue"){
	   h1=value;
	   }
	   else if(key=="smallSensorValue"|key=='#smallSensorValue'){
	   h2=value;
       }
	   var theLine=d3.select("#theLine")
	   theLine
	   .attr("x1","0").attr("y1",svgHeight-h1).attr("x2",linelength)
	   .attr("y2",svgHeight-h2).attr("stroke","green");
	   findAngles();
       }
       socket.onclose = function(){
       console.log("socket Closed");}
       
       }else{
       console.log("invalid socket");
       }}});