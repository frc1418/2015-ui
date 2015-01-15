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
logging.basicConfig(level=logging.DEBUG)
define("port", default=8888, help="run on the given port", type=int)
'''
this should read and set values on a networktable when instructed,
'''
#link - http://localhost:8889/
#ip is probably 127.0.0.1
ipadd='127.0.0.1'
if len(ipadd) != 2:
        print("Error: specify an IP to connect to!")
NetworkTable.setIPAddress(ipadd)
NetworkTable.setClientMode()
NetworkTable.initialize()
sd = NetworkTable.getTable("SmartDashboard")
#sd.addTableListener(valueChanged)
class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def __init__(self,application, request, **kwargs):
        sd.addTableListener(self.valueChanged)
        print('tableListenerhopefullyadded')
        super().__init__(application,request)
        
    print('echowebsocket created')
        
    def changeValue(self,key,value):
            print(key,'has been changed to',value)
            message=key+'|'+value
            self.write_message(message,False)
            #send a message to the website to change the value of the element
            #whose id=key to value
    def valueChanged(self,table, key, value, isNew):
            IOLoop.current().add_callback(self.changeValue,key,value)
            
    
    def check_origin(self, origin):
        return True
    def open(self):
        print ("WebSocket opened")
    def writeStringToNetworkTable(self,message):
        '''
        message=key|message
        '''
        delimiterIndex=message.index('|')
        key=message[:delimiterIndex]
        newMessage=message[delimiterIndex+1:]
        print('key-',key,',message-',newMessage)
        sd.putString(key,newMessage)
    def on_message(self, message):
        prntout="You said:"+message
        print(prntout)
        #self.write_message(prntout,False)
        self.writeStringToNetworkTable(message)

    def on_close(self):
        print("WebSocket closed")

    #connectToIP(ipadd)

app = tornado.web.Application([
    (r'/', EchoWebSocket),
])
if __name__ == '__main__':
    print('starting')
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
    print('goodbye')
#connectToIP(ipadd)
        
        