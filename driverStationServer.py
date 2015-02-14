#!/usr/bin/env python3

import tornado.ioloop
from tornado.ioloop import IOLoop
import tornado.web
import tornado.websocket
import sys
import time
from networktables import NetworkTable
from tornado.websocket import WebSocketHandler
from tornado.websocket import WebSocketClosedError
from tornado.options import define, options, parse_command_line
import logging
import json
import os.path
from threading import RLock
logging.basicConfig(level=logging.DEBUG)

table_data_lock = RLock()
tagged_tables = list()


class WebSocket(tornado.websocket.WebSocketHandler):

    #
    # WebSocket API
    #

    def check_origin(self, origin):
        return True
    def open(self):

        self.ioloop = IOLoop.current()
        self.sd = NetworkTable.getTable("SmartDashboard")
        self.sd.addTableListener(self.valueChanged, immediateNotify=True)
        self.sd.addSubTableListener(self.subtableValueChanged);

    def on_message(self, message):
        data=json.loads(message)
        #print(data)
        key = data['key']
        val = data['value']
       
        print('key-',key,',val-',val,' type is ', type(val))

        self.nt.putValue(key, val)
    def writeToSubtable(self,message):

        key=message['key']
        newMessage=message["value"]
        tableName=message["tableName"]
        
        subtable=self.sd.getSubTable(tableName)

        subtable.putValue(key, newMessage)      #this line writes to subtable but breaks code

    def on_close(self):
        print("WebSocket closed")
        self.sd.removeTableListener(self.valueChanged)

    #
    # NetworkTables specific stuff
    #
    def watch_table(self,key):
        print("Watching Table " + key)
        with table_data_lock:
            if key in tagged_tables:
                return
            new_table = self.sd.getTable(key)
            new_table.addSubTableListener(self.subtableValueChanged)
            new_table.addTableListener(self.valueChanged, True)

    def subtableValueChanged(self,table, key, value, isNew):
        if table.containsSubTable(key):
            self.watch_table(value.path)
        else:
            self.ioloop.add_callback(self.changeValue,key,value,"subtableValueChanged")
    def valueChanged(self,table, key, value, isNew):
        self.ioloop.add_callback(self.changeValue,key,value,"valueChanged")

    def changeValue(self, key, value, event):
        #sends a message to the driverstation
        message={'key':key,
                 'value':value,
                 'event':event}
        try:
            self.write_message(message, False)
        except WebSocketClosedError:
            print("websocket closed when attempting to changeValue")

    def writeToNetworkTable(self, message):#message is a dictionary

        key=message['key']
        newMessage=message["value"]
        print('key-',key,',message-',newMessage,' type is ', type(newMessage))

        self.sd.putValue(key, newMessage)


    def writeStringToNetworkTable(self, key,message):#key is a string, message is a string

        print('key-',key,',message-',message,' type is ', type(newMessage))
        self.sd.putValue(key, message)



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
        (r'/ws', WebSocket),
        (r"/(.*)", MyStaticFileHandler, {"path": os.path.dirname(__file__)}),

    ])
    
    print("Listening on ws://localhost:%s/ws" % options.port)
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()

#connectToIP(ipadd)
