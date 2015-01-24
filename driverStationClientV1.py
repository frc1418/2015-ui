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


class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def __init__(self,application, request, **kwargs):
        
        self.sd = NetworkTable.getTable("SmartDashboard")
        self.sd.addTableListener(self.valueChanged)
        
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
        self.sd.putString(key,newMessage)

    def getStringValue(self,message):
        key=message['key']
        value=self.sd.getString(message['key'])
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

def init_networktables(ipaddr):
    
    print("Connecting to networktables at %s" % ipaddr)
    NetworkTable.setIPAddress(ipaddr)
    NetworkTable.setClientMode()
    NetworkTable.initialize()
    
    print("Networktables Initialized")


def main():
    
    define("host", default='127.0.0.1', help="Hostname of robot", type=str)
    define("port", default=8888, help="run on the given port", type=int)
    
    parse_command_line()
    
    init_networktables(options.host)
    
    app = tornado.web.Application([
        (r'/ws', EchoWebSocket),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": os.path.dirname(__file__)}),
    
    ])
    
    print("Listening on http://localhost:%s" % options.port)
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
    
#connectToIP(ipadd)
