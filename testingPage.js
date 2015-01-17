$(document).ready(
    function(){
});
jQuery(function($){
       if (!("WebSocket" in window)) {
       alert("Your browser does not support web sockets");
       }else{
       setup();
       }
       function setup(){
       var host = "ws://localhost:8888/";
       var socket = new WebSocket(host);
       var $key=$("#keyField");
       var $txt = $("#textField");
       var $submitForm = $("#submitForm");
       
       $submitForm.submit(function(event){
                event.preventDefault();
                var key=$key.val();
                var text = $txt.val();
                var sendtxt=key+"|"+text;
                   if(text == ""){
                   return;
                   }
                   socket.send(sendtxt);
                   //$txt.val("");
                   });
       if(socket){
       socket.onopen = function(){
       }
       socket.onmessage = function(msg){
       //at the moment have it default to showing in messageText
       //it should in the future find the thing with the id ==key
       var msgTxt=msg.data;
       var delimiterIndex=msgTxt.indexOf("|");
       var messageValue=msgTxt.substring(delimiterIndex);
       var keyValue=msgTxt.substring(0,delimiterIndex);
       $("#messageText").text("key-"+keyValue);
       $("#messageText2").text("value-"+messageValue);
       $("#messageText3").text(msgTxt);
       }
       socket.onclose = function(){
       console.log("socket Closed");}
       
       }else{
       console.log("invalid socket");
       }}});