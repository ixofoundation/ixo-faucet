FROM --platform=linux/amd64 node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --pure-lockfile

COPY . .

EXPOSE 80

CMD ["yarn","start"]
