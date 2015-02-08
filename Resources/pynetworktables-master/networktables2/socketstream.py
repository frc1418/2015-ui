import socket

__all__ = ["SocketStreamFactory", "SocketServerStreamProvider"]

class SocketStream:
    def __init__(self, conn):
        self.conn = conn

    def getInputStream(self):
        return self.conn.makefile('rb')

    def getOutputStream(self):
        return self.conn.makefile('wb')

    def close(self):
        self.conn.close()

class SocketStreamFactory:
    def __init__(self, host, port):
        self.host = host
        self.port = port

    def createStream(self):
        return SocketStream(socket.create_connection((self.host, self.port)))

class SocketServerStreamProvider:
    def __init__(self, port):
        self.server = socket.socket()
        self.server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server.bind(('', port))
        self.server.listen(50)
        # this fails in 2.7... need a better way of dealing with the timeout problem,
        # or make the timeout bigger
        #self.server.settimeout(1.0)

    def accept(self):
        return SocketStream(self.server.accept()[0])
