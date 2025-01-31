FROM node:20-alpine

WORKDIR /app

RUN npm install -g firebase-tools

COPY . . 
COPY .firebaserc ./
COPY firebase.json ./

RUN cd packages/frontend && yarn install
RUN cd packages/functions && yarn install && yarn build

EXPOSE 4000 5001 5173

CMD ["sh", "-c", "yarn start:be & yarn start:fe"]