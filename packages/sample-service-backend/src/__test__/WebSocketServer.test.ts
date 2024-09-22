import http from "http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WebSocketServer } from "ws";
import { WSServer } from "../WebSocketServer";

const { mockSend, mockOn } = vi.hoisted(() => {
  return { mockSend: vi.fn(), mockOn: vi.fn() };
});

vi.mock("ws", () => {
  return {
    WebSocketServer: vi.fn().mockImplementation(() => {
      return {
        on: mockOn,
        clients: new Set([{ send: mockSend }, { send: mockSend }]),
      };
    }),
  };
});

describe("WSServer", () => {
  let httpServer: http.Server;
  let wsServer: WSServer;

  beforeEach(() => {
    httpServer = new http.Server();
    wsServer = new WSServer(httpServer);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create a WebSocketServer with the provided http server", () => {
    expect(WebSocketServer).toHaveBeenCalledWith({ server: httpServer });
  });

  it("should set up a connection listener", () => {
    new WSServer(httpServer);

    expect(mockOn).toHaveBeenCalledWith("connection", expect.any(Function));
  });

  it("should set up a message listener for each connection", () => {
    const mockWsOn = vi.fn();

    mockOn.mockImplementation((event, callback) => {
      if (event === "connection") {
        callback({ on: mockWsOn });
      }
    });

    new WSServer(httpServer);

    expect(mockWsOn).toHaveBeenCalledWith("message", expect.any(Function));
  });

  it("should log a warning when a message is received", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const mockWs = { on: vi.fn() };

    mockOn.mockImplementation((event, callback) => {
      if (event === "connection") {
        callback(mockWs);
      }
    });

    new WSServer(httpServer);

    const messageHandler = mockWs.on.mock.calls.find(
      (call) => call[0] === "message"
    )?.[1];
    messageHandler("test message");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Received message. Not supported:",
      "test message"
    );
  });

  it("should broadcast messages to all clients", () => {
    const server = new WSServer(httpServer);
    server.broadcast("test broadcast");

    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockSend).toHaveBeenCalledWith("test broadcast");
  });
});
