var keyExceptions=new Array();
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
                var protoJson={
                                 "key":key,
                                 "value":text,
                                 "action":"write",
                                 "sendTo":"#messageText3"
                                 };
                var sendFile=JSON.stringify(protoJson);
                   if(text == ""){
                   return;
                   }
                keyExceptions[key]="#messageText3";
                   socket.send(sendFile);
                   //$txt.val("");
                   });
       var $readForm=$("#readForm");
       $readForm.submit(
                        function(event){
            event.preventDefault();
                        var key=$("#readKeyField").val();
                        var protoJson={
                        "key":key,
                        "action":"read",
                        "sendTo":"#readTextField"
                        };
                        var sendFile=JSON.stringify(protoJson);
                        socket.send(sendFile);
            });

       if(socket){
       socket.onopen = function(){
       }
       socket.onmessage = function(msg){
       //checks for sendTo, if no send to id of key
       //it should in the future find the thing with the id ==key
       //console.log(msg.data);
       var data=JSON.parse(msg.data);
       console.log(data);
       var value=data['value'];
       var key=data['key'];
       var sendTo=data['sendTo'];
       var event=data['event'];
       console.log("key-"+key+" is changed to "+value);
       if(event=='valChanged'){
       sendTo=keyExceptions[key];
       $(sendTo).text(value);
       }else if(event=="read"){
       $(sendTo).val(value);
       }
       
       }
       socket.onclose = function(){
       console.log("socket Closed");}
       
       }else{
       console.log("invalid socket");
       }}});