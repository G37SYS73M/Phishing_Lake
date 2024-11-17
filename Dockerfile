FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY project_src/package*.json ./
USER node
RUN npm install
COPY project_src/ /home/node/app/
COPY --chown=node:node . .
EXPOSE 8080
CMD [ "node", "app.js" ]