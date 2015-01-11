import tornado.ioloop
import tornado.web

from tornado.options import define, options, parse_command_line, websocket

define("port", default=8888, help="run on the given port", type=int)

        
        
class IndexHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    #use websockets to communicate with the browser
    def get(self):
        #from my understanding this function is executed when a webpage connects to the port
        self.write("This is your response")#printing to the console, in this case the document
        self.finish()#ends the server or something(doesn't end the program), check it.

app = tornado.web.Application([
    (r'/', IndexHandler),
])

if __name__ == '__main__':
    parse_command_line()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()