# Gunakan official Node.js 20 image
FROM node:20

# Set working directory di container
WORKDIR /app

# Salin package.json dan yarn.lock dulu (untuk caching layer yang efisien)
COPY package.json yarn.lock ./

# Install Yarn global dan dependencies
RUN npm install -g yarn && yarn install

# Salin semua source code
COPY . .

# Build admin panel Strapi (buat front-endnya)
RUN yarn build

# Buka port default Strapi
EXPOSE 1337

# Jalankan Strapi
CMD ["yarn", "start"]
