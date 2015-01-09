//external file doing the jquery stuff
$(document).ready(
    function(){
    //alert("clicked");
});
    $("#pingButton").click(
    function(){
    //$("#messageText").text("Button Clicked"); disabled for the time being
    
                           });


//stolen websocket code
jQuery(function($){
       
       if (!("WebSocket" in window)) {
       alert("Your browser does not support web sockets");
       }else{
       setup();
       }
       
       
       function setup(){
       
       // Note: You have to change the host var
       // if your client runs on a different machine than the websocket server
       
       var host = "ws://localhost:8889/";           //ws + localhost + portnum + uri
       var socket = new WebSocket(host);            //currently failing to connect to websocket onthis line
       //console.log("socket status: " + socket.readyState);
       
       var $txt = $("#inputField");       //    original=  var $txt = $("#data");
       var $btnSend = $("#pingButton");       //original=        var $btnSend = $("#sendtext");

       
       $txt.focus();
       
       // event handlers for UI
       $btnSend.on('click',function(){
                   //alert("send button clicked");
                   var text = $txt.val();
                   if(text == ""){
                   return;
                   }
                   socket.send(text);
                   $txt.val("");
                   });
       
       /*$txt.keypress(function(evt){
                     if(evt.which == 13){
                     $btnSend.click();
                     }
                     });*/
       
       // event handlers for websocket
       if(socket){
       
       socket.onopen = function(){
       //alert("connection opened....");
       }
       
       socket.onmessage = function(msg){
       showServerResponse(msg.data);
       //$("#messageText").text(msg);         //testing, remove if needed
       //alert(msg);
       }
       
       socket.onclose = function(){
       //alert("connection closed....");
       showServerResponse("The connection has been closed.");
       }
       
       }else{
       console.log("invalid socket");
       }
       
       function showServerResponse(txt){
       var p = document.createElement('p');
       p.innerHTML = txt;
       //original =  document.getElementById('output').appendChild(p);
       alert(txt);
       }	
       
       
       }
       
       });
