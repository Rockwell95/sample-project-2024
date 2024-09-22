import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { RestApi } from "../RestApi";
import { WSServer } from "../WebSocketServer";
import http from "http";
import _ from "lodash";
import { L } from "vitest/dist/chunks/reporters.WnPwkmgA";
import Test from "supertest/lib/test";

vi.useFakeTimers();

describe("RestApi", () => {
  let httpServer: http.Server;
  let wsServer: WSServer;
  let restApi: RestApi;

  beforeEach(() => {
    httpServer = new http.Server();
    wsServer = new WSServer(httpServer);
    restApi = new RestApi(wsServer);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct middleware", () => {
    const app = restApi.app;
    expect(app._router.stack).toHaveLength(6); // Express, cors, bodyParser, 2 routes, final handler
    expect(app._router.stack[2].name).toBe("corsMiddleware");
    expect(app._router.stack[3].name).toBe("rawParser");
  });

  it("should return current total on GET /", async () => {
    const response = await request(restApi.app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("0");
  });

  it("should add to total and return new total on valid POST /", async () => {
    const response = await request(restApi.app)
      .post("/")
      .send("5")
      .set("Content-Type", "text/plain");

    expect(response.status).toBe(200);
    expect(response.text).toBe("5");
  });

  it("should be able to handle multiple concurrent requests to add to total and return new total on valid POST /", async () => {
    const promises: Test[] = [];
    // Send 999 requests...
    for (let i = 0; i < 999; i++) {
      promises.push(
        request(restApi.app)
          .post("/")
          .send("5")
          .set("Content-Type", "text/plain")
      );
    }

    await Promise.all(promises);

    // On the thousandth request, check the total:
    const response = await request(restApi.app)
      .post("/")
      .send("5")
      .set("Content-Type", "text/plain");
    expect(response.status).toBe(200);
    expect(response.text).toBe("5000");
  });

  it("should return 400 on invalid POST /", async () => {
    const response = await request(restApi.app)
      .post("/")
      .send("invalid")
      .set("Content-Type", "text/plain");

    expect(response.status).toBe(400);
  });

  it("should debounce sendTotal calls", async () => {
    const debounceSpyFactory = vi.spyOn(_, "debounce");

    new RestApi(wsServer);

    expect(debounceSpyFactory).toHaveBeenCalledWith(
      expect.any(Function),
      30000
    );
  });

  it("should broadcast total and reset after debounce period", async () => {
    const broadcastSpy = vi.spyOn(wsServer, "broadcast");

    await request(restApi.app).post("/").send("5");
    await request(restApi.app).post("/").send("10");

    expect(broadcastSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(30000);

    expect(broadcastSpy).toHaveBeenCalledWith("15");

    const response = await request(restApi.app).get("/");
    expect(response.text).toBe("0");

    vi.useRealTimers();
  });
});
