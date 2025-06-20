FROM node:alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

CMD ["pnpm", "dev"]
