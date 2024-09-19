import { WebSocketServer } from "ws";
import http from "http";

export class WSServer {
  private _server: WebSocketServer;
  constructor(httpServer: http.Server) {
    this._server = new WebSocketServer({
      server: httpServer,
    });

    this._server.on("connection", (ws) => {
      ws.on("message", (message) => {
        console.warn("Received message. Not supported:", message);
      });
    });
  }

  public broadcast(message: string) {
    for (const client of this._server.clients) {
      client.send(message);
    }
  }
}
