FROM node:20

WORKDIR /app

# Salin package.json dan yarn.lock dulu untuk caching
COPY package.json ./

# Langsung install dependencies pakai yarn tanpa install ulang yarn global
RUN yarn install

# Salin semua source code setelah install dependencies
COPY . .

# Build strapi admin panel
RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]
