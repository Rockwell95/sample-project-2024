import http from "http";
import { WSServer } from "./WebSocketServer.js";
import { RestApi } from "./RestApi.js";

const server = http.createServer();
const port = 4000;

// Connect WS Server
const wsServer = new WSServer(server);
const restApi = new RestApi(wsServer);

// Connect express:
server.on("request", restApi.app);

server.listen(port, function () {
  console.log(`http/ws server listening on ${port}`);
});
