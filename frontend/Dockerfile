FROM node:14

WORKDIR /usr/app

COPY . .

ENV REACT_APP_API_URL "http://api.pet.inf.ufes.br"
RUN npm install
RUN npm install serve
RUN npm run build

CMD npx serve -s build