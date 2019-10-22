FROM ubuntu:18.04

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

# Setup chrome
RUN apt-get install -y curl \
    && apt-get install -y software-properties-common \
    && add-apt-repository ppa:canonical-chromium-builds/stage \
    && apt-get update \
    && apt-get -y install chromium-browser

# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

## SETUP NODE
# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 8.10.0

# install nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# confirm installation
RUN node -v
RUN npm -v

# ENVs
ENV PORT 8081

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# building code for production
RUN npm install --only=production

# Bundle app source
COPY . .

# Copy fonts
COPY fonts/*.ttf /usr/share/fonts/
RUN fc-cache -f -v

# Install pm2
RUN npm install pm2 -g

# Cleanup
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 8081
ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "index.js"]