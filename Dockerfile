FROM node

WORKDIR /api

COPY . .

RUN npm i

EXPOSE 3000

CMD ["node","./server.js"] 

#RUN npm start
