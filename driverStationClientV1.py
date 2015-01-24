import tornado.ioloop
from tornado.ioloop import IOLoop
import tornado.web
import tornado.websocket
import sys
import time
from networktables import NetworkTable
from tornado.websocket import WebSocketHandler
from tornado.options import define, options, parse_command_line
import logging
import json
import os.path
logging.basicConfig(level=logging.DEBUG)
define("port", default=8888, help="run on the given port", type=int)
'''
this should read and set values on a networktable when instructed,
'''
#link - http://localhost:8889/
#ip is probably 127.0.0.1
ipadd='10.14.18.2'
#if len(ipadd) != 2:
        #print("Error: specify an IP to connect to!")
NetworkTable.setIPAddress(ipadd)
NetworkTable.setClientMode()
NetworkTable.initialize()
sd = NetworkTable.getTable("SmartDashboard")
class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def __init__(self,application, request, **kwargs):
        sd.addTableListener(self.valueChanged)
        super().__init__(application,request)
        
        
    def changeValue(self,key,value):
            print(key,'has been changed to',value)
            
            message={'key':key,'value':value,'sendTo':"#"+key,'event':'valChanged'}
            sendMessage=json.dumps(message)
            self.write_message(sendMessage,False)
            #send a message to the website to change the value of the element
            #whose id=key to value
    def valueChanged(self,table, key, value, isNew):
            IOLoop.current().add_callback(self.changeValue,key,value)
            
    
    def check_origin(self, origin):
        return True
    def open(self):
        print ("WebSocket opened")
    def writeStringToNetworkTable(self,message):
        #message=key|message
        key=message['key']
        newMessage=message["value"]
        print('key-',key,',message-',newMessage)
        sd.putString(key,newMessage)
    def getStringValue(self,message):
        key=message['key']
        value=sd.getString(message['key'])
        print(value,'-read, from key-',key)
        message['value']=value
        message['event']='read'
        sendmsg=json.dumps(message)
        self.write_message(sendmsg, False)
    def on_message(self, message):
        data=json.loads(message)
        #data=json.
        print("Recieved-",data)
        actiontype=data["action"]
        if actiontype=='read':
            self.getStringValue(data)
        elif actiontype=="write":
            self.writeStringToNetworkTable(data)
    def on_close(self):
        print("WebSocket closed")
        

app = tornado.web.Application([
    (r'/ws', EchoWebSocket),
    (r"/(.*)", tornado.web.StaticFileHandler, {"path": os.path.dirname(__file__)}),
    
])
if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
#connectToIP(ipadd)
        
        