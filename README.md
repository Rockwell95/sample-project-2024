# Sample Project 2024

## System Requirements

To run this project, the following software must be installed:

1. Docker v27.2 or later
2. Node v20 LTS

The following utilities are recommended but not required:

1. Chromium or alternative browser
2. Postman

## Getting Started

### Preparing the Repo

1. Clone this repo:
   1. `git clone https://github.com/Rockwell95/sample-project-2024`
2. Open a terminal in the Repo:
   1. `cd sample-project-2024`
3. Install the dependencies:
   1. `npm install`

### Building the Code

#### Sample API, Sample Service Backend, and Sample Service GUI

1. From the repo root, run the following command:
   1. `npm run docker:build`

#### Monitor Service

1. From the repo root, run the following command:
   1. `npm run build:monitor-service`

## Running the Project

#### Sample API, Sample Service Backend, and Sample Service GUI

1. From the repo root, run the following command:
   1. `npm run docker:start`

#### Monitor Service

1. From the repo root, run the following command:
   1. `node ./packages/monitor-service/build/index.mjs`

## Accessing the Project

1. The Sample API is hosted at http://localhost:3000
2. The Sample Service backend is hosted at http://localhost:4000
3. The Sample Service GUI is hosted at http://localhost:8080

## Using the Sample API

### Authenticating

TODO

### CRUD Operations

TODO

## Using the Sample Service

1. Open the sample service UI at http://localhost:8080
2. In the text field, enter a value.
3. The "running total" value will update accordingly.
4. After 30 seconds of no input, the "INCOMPLETE" pane will turn green, read "COMPLETE" and show the final total.
5. Entering a new numeric value will restart the process.

### Endpoints

1. `GET /` - Gets the current running total
2. `POST /` - Adds the provided number to the running total, and replies with the new running total
   1. Params:
      1. a single, base-10, numeric value
3. `WS /` - A websocket that will send the final total after 30 seconds of inactivity. This websocket does not listen to incoming messages.

## Stopping the Project

#### Sample API, Sample Service Backend, and Sample Service GUI

1. From the repo root, run the following command:
   1. `npm run docker:stop`

#### Monitor Service

1. From the shell attached to the service, run the following command:
   1. `q`

## Testing

All unit tests use Vitest, and can be run from the repo root with the following command:
`npm run test`
