FROM node:20

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .

# Set build-time environment variables
ARG URL=https://cms.jaripmi.info
ARG ADMIN_URL=https://cms.jaripmi.info/admin
ENV URL=$URL
ENV ADMIN_URL=$ADMIN_URL

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]