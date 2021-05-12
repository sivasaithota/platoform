###### Base Image ######

FROM  node:12.16 as base
RUN mkdir /workspace
COPY . /workspace/
WORKDIR /workspace
RUN npm install \
    && npm run build

###### Final Image ######

FROM node:12.16-alpine
WORKDIR /src
RUN apk add postgresql-client postgresql-dev bash zip unzip mongodb-tools
COPY --from=base /workspace/app ./app
COPY --from=base /workspace/.npmrc ./.npmrc
COPY --from=base /workspace/package* ./
COPY --from=base /workspace/configs ./configs
COPY --from=base /workspace/config ./config
COPY --from=base /workspace/migrations ./migrations
COPY --from=base /workspace/migrate-mongo-config.js ./migrate-mongo-config.js
COPY --from=base /workspace/node_modules ./node_modules
COPY --from=base /workspace/public ./public
EXPOSE 8000
CMD ["npm","run","start"]
