import { useEffect, useState } from "react";
import { InputPanel } from "./InputPanel";
import { StatusPanel } from "./StatusPanel";
import axios from "axios";

export const MainCard = () => {
  useEffect(() => {
    let ws: WebSocket;
    (async () => {
      const configJson = (await axios.get("/config.json")).data;
      setConfig(configJson);
      ws = new WebSocket(configJson.wsUrl, "echo-protocol");

      ws.addEventListener("message", (ev) => {
        setIsComplete(true);
        setRunningTotal(ev.data);
      });

      setRunningTotal((await axios.get(configJson.backendUrl)).data);
    })();

    return () => {
      ws?.close();
    };
  }, []);

  const sendNumber = async () => {
    const reply = await axios.post(config.backendUrl, value);
    setRunningTotal(reply.data);
    setIsComplete(false);
  };

  const [value, setValue] = useState<number>(0);
  const [config, setConfig] = useState<{ [key: string]: string }>({});
  const [runningTotal, setRunningTotal] = useState<number>(0);

  const [isComplete, setIsComplete] = useState<boolean>(false);

  return (
    <div className="card">
      <div className="card-content">
        <InputPanel onChange={setValue} value={value} />
        <StatusPanel total={runningTotal} isComplete={isComplete} />
      </div>
      <div className="card-footer">
        <a onClick={sendNumber} className="card-footer-item">
          Send
        </a>
      </div>
    </div>
  );
};
