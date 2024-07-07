FROM node:20-alpine3.18 AS appbuild
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Build Stage 2
# This build takes the production build from staging build
#
FROM node:20-alpine3.18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY --from=appbuild /usr/src/app/dist ./dist
EXPOSE 5001
CMD npm start