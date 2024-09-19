FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN cd /app/packages/sample-api && npx prisma generate && cd ../../

RUN npm run build

FROM node:20-alpine3.20 AS runner

WORKDIR /app

RUN npm i -g http-server

COPY --from=builder /app/packages/sample-api/build /app/sample-api
COPY --from=builder /app/node_modules/prisma/libquery_engine-linux-musl-openssl-3.0.x.so.node /app/

COPY --from=builder /app/packages/sample-service-ui/dist /app/sample-service-ui

COPY --from=builder /app/packages/sample-service-backend/build /app/sample-service-backend

CMD [ "/bin/node", "/app/sample-api/index.js" ]