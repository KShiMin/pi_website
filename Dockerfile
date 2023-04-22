FROM node:16

# create app directory
WORKDIR /usr/scr/app

# install app dependencies
# A wildcare will be used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install 
# for production use 
# RUN NPM ci --omit=dev
RUN npm install npm@latest -g && npm install n -g && n latest

# bundle app source
COPY . .

# expose port to be used
EXPOSE 8080

CMD ["npm", "run", "dev"]