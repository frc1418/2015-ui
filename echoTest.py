import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado.websocket import WebSocketHandler
from tornado.options import define, options, parse_command_line

define("port", default=8889, help="run on the given port", type=int)
#link - http://localhost:8889/
#experimental websocket
class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True
    def open(self):
        print ("WebSocket opened")
        
    def on_message(self, message):
        self.write_message("You said: " , message)
        print("messge recieved",message)

    def on_close(self):
        print("WebSocket closed")
        
        
app = tornado.web.Application([
    (r'/', EchoWebSocket),
])

if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()