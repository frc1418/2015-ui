from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url

class HelloHandler(RequestHandler):
    def get(self):
        self.write("Hello, world")
        #in http://localhost:8888
def make_app():
    return Application([
        url(r"/", HelloHandler),
        ])

def main():
    app = make_app()
    app.listen(8888)
    IOLoop.current().start()