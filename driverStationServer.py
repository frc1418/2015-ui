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



class WebSocket(tornado.websocket.WebSocketHandler):

    #
    # WebSocket API
    #

    def check_origin(self, origin):
        return True
    
    def open(self):

        self.ioloop = IOLoop.current()
        self.nt = NetworkTable.getGlobalTable()
        NetworkTable.addGlobalListener(self.valueChanged, immediateNotify=True)
        self.nt.putValue('imgUrl', options.camUrl)

    def on_message(self, message):
        data=json.loads(message)

        key = data['key']
        val = data['value']
        print('key-',key,' val-',val)
        print('key-',key,',val-',val,' type is ', type(val))

        self.nt.putValue(key, val)
   
    def on_close(self):
        print("WebSocket closed")
        NetworkTable.removeGlobalListener(self.valueChanged)

    #
    # NetworkTables specific stuff
    #
            
    def valueChanged(self, key, value, isNew):
        self.ioloop.add_callback(self.changeValue, key, value,"valueChanged")

    def changeValue(self, key, value, event):
        #sends a message to the driverstation
        message={'key':key,
                 'value':value,
                 'event':event}
        
        try:
            self.write_message(message, False)
        except WebSocketClosedError:
            print("websocket closed when sending message")

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
    
    def set_extra_headers(self, path):
        # Disable caching
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')


def main():
    define("camUrl", default="http://10.14.18.2:8080", help="url of the cam feed", type=str)
    define("host", default='127.0.0.1', help="Hostname of robot", type=str)
    define("port", default=8888, help="run on the given port", type=int)

    parse_command_line()

    init_networktables(options.host)

    app = tornado.web.Application([
        (r'/ws', WebSocket),
        (r"/()", MyStaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), 'UI_MainPage.html')}),
        (r"/(.*)", MyStaticFileHandler, {"path": os.path.dirname(__file__)}),
    ])
    
    print("Listening on http://localhost:%s/" % options.port)
    print("- Websocket API at ws://localhost:%s/ws" % options.port)

    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()

#connectToIP(ipadd)
