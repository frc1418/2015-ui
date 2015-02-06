#!/usr/bin/env python3

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

    #
    # WebSocket API
    #

    def check_origin(self, origin):
        return True

    def open(self):
        print("New WebSocket open")
        
        self.ioloop = IOLoop.current()
        self.sd = NetworkTable.getTable("SmartDashboard")
        self.sd.addTableListener(self.valueChanged, immediateNotify=True)
        
        
    def on_message(self, message):

        data=json.loads(message)
        
        actiontype=data["action"]
        

        if actiontype=='read':
            self.getStringValue(data)

        elif actiontype=="write":
            self.writeJSONStringToNetworkTable(data)

    def on_close(self):
        print("WebSocket closed")
        self.sd.removeTableListener(self.valueChanged)

    #
    # NetworkTables specific stuff
    #
    
    def valueChanged(self,table, key, value, isNew):
        self.ioloop.add_callback(self.changeValue,key,value)

    def changeValue(self, key, value):
        '''
            Sends a message to the website to change the value of the element
            whose id=key to value
        '''
        
        message={'key':key,
                 'value':value, 
                 'event':'valChanged'}
        
        self.write_message(message, False)
    
    def writeJSONStringToNetworkTable(self, message):#json String
        #message=key|message
        key=message['key']
        newMessage=message["value"]
        print('key-',key,',message-',newMessage)
        self.sd.putString(key, newMessage)
    def writeStringToNetworkTable(self, key,message):#key is a string, message is a string
        #message=key|message
        print('key-',key,',message-',message)
        self.sd.putString(key, message)

    def getStringValue(self, message):
        key=message['key']
        value=self.sd.getString(message['key'])
        print(value,'-read, from key-',key)
        message['value']=value
        message['event']='read'
        sendmsg=json.dumps(message)
        self.write_message(sendmsg, False)
    
    

def init_networktables(ipaddr):
    
    print("Connecting to networktables at %s" % ipaddr)
    NetworkTable.setIPAddress(ipaddr)
    NetworkTable.setClientMode()
    NetworkTable.initialize()
    
    print("Networktables Initialized")


class MyStaticFileHandler(tornado.web.StaticFileHandler):
    
    # This is broken in tornado, disable it
    def check_etag_header(self):
        return False

def main():
    
    define("host", default='127.0.0.1', help="Hostname of robot", type=str)
    define("port", default=8888, help="run on the given port", type=int)
    
    parse_command_line()
    
    init_networktables(options.host)
    
    app = tornado.web.Application([
        (r'/ws', EchoWebSocket),
        (r"/(.*)", MyStaticFileHandler, {"path": os.path.dirname(__file__)}),
    
    ])
    
    print("Listening on http://localhost:%s" % options.port)
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
    
#connectToIP(ipadd)
