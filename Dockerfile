FROM node:20

WORKDIR /app

# Copy package files for better Docker layer caching
COPY package.json yarn.lock* ./
RUN yarn install

COPY . .

# Set ALL required build-time environment variables
ARG URL=https://cms.jaripmi.info
ARG ADMIN_URL=https://cms.jaripmi.info/admin
ARG HOST=0.0.0.0
ARG PORT=8080

ENV URL=$URL
ENV ADMIN_URL=$ADMIN_URL  
ENV NODE_ENV=production
ENV HOST=$HOST
ENV PORT=$PORT
ENV STRAPI_ADMIN_BACKEND_URL=https://cms.jaripmi.info

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]