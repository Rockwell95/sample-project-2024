# Sample Project 2024

## System Requirements

To run this project, the following software must be installed:

1. Docker v27.2 or later
2. Node v20 LTS

The following utilities are recommended but not required:

1. Chromium or alternative browser
2. Postman
   1. Use the included `Sample API.postman_collection.json` file to interact with the Sample API

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

NOTE: All Sample API endpoints can be found in `Sample API.postman_collection.json` at the root of this repo.

#### Registering a User

1. Make a `POST` request to http://localhost:3000/auth/register with the following body:

```json
{
  "email": "<new user email address>",
  "password": "<password>"
}
```

### Logging In

1. Make a `POST` request to http://localhost:3000/auth/login with the following body:

```json
{
  "email": "<existing user email address>",
  "password": "<password>"
}
```

2. A response similar to the following will be received:

```json
{
  "accessToken": "<jwt access token>",
  "refreshToken": "<jwt refresh token>"
}
```

3. Copy the value of `accessToken` into the Authorization header of any requests made to the server as a Bearer token:
   1. `Authorization: Bearer <jwt access token>`
4. NOTE: JWT tokens remain valid for only 5 minutes, while the refresh token lasts 8 hours. To refresh the authentication without requiring a new login, Make a `POST` request to http://localhost:3000/auth/refreshToken with the following body (using the `refreshToken` from step 2:

```json
{
  "refreshToken": "<jwt refresh token>"
}
```

5. A new access and refresh token will be provided in response in the same format as step 2. To continue making requests, use the newly provided access token from this response. To refresh the login again, use the newly provided refresh token from this response.

### CRUD Operations

NOTE: All CRUD operations require Bearer Token authentication, and must be provided as `Content-Type: application/json`

#### `GET /books`

- Gets all books in the database
- Response Format:

```ts
{
  id: number;
  published: Date;
  updatedAt: Date; // Date of last update
  title: string;
  summary: string | null; //Optional field, may be null
  author: string;
}
[];
```

#### `POST /book`

- Adds a new book to the database
- Request format:

```ts
{
   id: number;
   published: Date;
   title: string;
   summary?: string //Optional field
   author: string;
}
```

- Responses:
  - `201 Created`
  - `400 Bad Request`

#### `PUT /book/<bookId>`

- Update an existing book in the database
- Request Format:

```ts
// All fields are optional
{
   id: number?;
   published?: Date;
   title?: string;
   summary?: string
   author?: string;
}
```

- Responses:
  - `200 OK`

#### `GET /book/<bookId>`

- Get a book by its ID in the database:

- Responses:
  - `404 Not Found`
  - `200 OK`
  ```ts
  {
    id: number;
    published: Date;
    updatedAt: Date; // Date of last update
    title: string;
    summary: string | null; //Optional field, may be null
    author: string;
  }
  ```

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
