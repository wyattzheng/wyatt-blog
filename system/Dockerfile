FROM node:16.1.0-alpine
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

CMD ["yarn","run","start:prod"]