FROM node:16
WORKDIR /home/app
COPY . /home/app
RUN npm install
EXPOSE 80
CMD ["npm", "run", "start:prod"]