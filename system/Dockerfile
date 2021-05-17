FROM node:16.1.0-alpine
WORKDIR /app
COPY . .
RUN yarn --registry=https://mirrors.cloud.tencent.com/npm/
RUN yarn build

CMD ["yarn","run","start:prod"]