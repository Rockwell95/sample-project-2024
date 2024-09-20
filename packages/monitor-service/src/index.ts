import readline from "node:readline";
import axios, { AxiosError } from "axios";
import { stdin as input, stdout as output } from "node:process";
import { Interface } from "node:readline";
import { execSync } from "node:child_process";

const HEARTBEAT_INTERVAL_MS = 5000;
const SAMPLE_SERVICE_BACKEND_URL = "http://localhost:4000";

let shouldRestart = true;

const main = async () => {
  const rl = readline.createInterface({ input, output });
  const heartbeat = setInterval(async () => {
    try {
      await axios.get(SAMPLE_SERVICE_BACKEND_URL);
      console.log(`[${new Date().toISOString()}] Backend is alive`);
    } catch (error) {
      console.warn("Error reaching service:", (error as AxiosError).message);

      if (shouldRestart) {
        console.warn("Restarting backend...");
        startBackend();
      } else {
        clearInterval(heartbeat);
      }
    }
  }, HEARTBEAT_INTERVAL_MS);

  console.info(
    "Welcome to the monitoring service. This service automatically monitors the sample service backend and restarts the service when it is down"
  );
  console.info(
    'To stop the backend, and have the monitor restart it, press "r"'
  );
  console.info(
    'To stop the backend without the monitor restarting it, press "k"'
  );
  console.info('To exit this service, press "q"');

  recursiveAsyncReadLine(rl);
};

const recursiveAsyncReadLine = (rl: Interface) => {
  rl.question("Command: ", (answer) => {
    if (answer === "q") {
      console.info("Exiting...");
      rl.close();
      process.exit(0);
    } else if (answer === "k") {
      console.info("Stopping backend permanently...");
      shouldRestart = false;
      stopBackend();
    } else if (answer === "r") {
      console.info(
        "Killing backend. Monitor will check if it is online and restart it on the next heartbeat"
      );
      stopBackend();
    } else {
      console.info(
        `Invalid command: "${answer}". Valid commands are "r", "k", and "q"`
      );
    }
    recursiveAsyncReadLine(rl); //Calling this function again to ask new question
  });
};

const stopBackend = () => {
  try {
    const stopCommand = execSync(
      "docker stop jsi-project-sample-service-backend-1"
    );
    console.log("Stopped service successfully!", stopCommand.toString());
  } catch (error: any) {
    console.warn("Error stopping backend");
    console.warn(error.status); // Might be 127 in your example.
    console.warn(error.message); // Holds the message you typically want.
    console.warn(error.stderr); // Holds the stderr output. Use `.toString()`.
    console.warn(error.stdout); // Holds the stdout output. Use `.toString()`.
  }
};

const startBackend = () => {
  try {
    const stopCommand = execSync(
      "docker restart jsi-project-sample-service-backend-1"
    );
    console.log("Started service successfully!", stopCommand.toString());
  } catch (error: any) {
    console.warn("Error starting backend");
    console.warn(error.status); // Might be 127 in your example.
    console.warn(error.message); // Holds the message you typically want.
    console.warn(error.stderr); // Holds the stderr output. Use `.toString()`.
    console.warn(error.stdout); // Holds the stdout output. Use `.toString()`.
  }
};

main();
