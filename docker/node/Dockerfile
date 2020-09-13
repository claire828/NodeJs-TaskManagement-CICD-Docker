
FROM node:10.15.1
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied# where available (npm@5+)
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9005

CMD [ "npm", "start" ]