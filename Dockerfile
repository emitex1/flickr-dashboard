FROM node:20-alpine

WORKDIR /app

RUN npm install -g firebase-tools

COPY . . 
COPY .firebaserc ./
COPY firebase.json ./

RUN cd packages/frontend && yarn install
RUN cd packages/functions && yarn install && yarn build

EXPOSE 5000 5001

CMD ["sh", "-c", "firebase emulators:start --only hosting,functions"]