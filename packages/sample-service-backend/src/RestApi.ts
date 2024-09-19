import express, { Express } from "express";
import { WSServer } from "./WebSocketServer.js";
import _ from "lodash";
import bodyParser from "body-parser";
import cors from "cors";

const DELAY = 30000; // 30 Seconds

export class RestApi {
  private readonly _app: Express;
  private readonly _wsServer: WSServer;

  private _total: number = 0;

  constructor(wsServer: WSServer) {
    this._wsServer = wsServer;
    this._app = express();
    this._app.use(cors({ origin: true }));
    this._app.use(bodyParser.raw({ type: "*/*" }));

    this._app.get("/", (req, res) => {
      res.status(200).send(`${this._total}`);
    });

    this._app.post("/", (req, res) => {
      const number = parseInt(req.body);

      if (!isNaN(number)) {
        this._addToTotal(number);
        res.status(200).send(`${this._total}`);
      } else {
        res.sendStatus(400);
      }
    });
  }

  private _addToTotal(number: number) {
    this._total += number;
    this._sendTotal();
  }

  private _sendTotal = _.debounce(() => {
    this._wsServer.broadcast(`${this._total}`);
    this._total = 0;
  }, DELAY);

  get app() {
    return this._app;
  }
}
