# Set node version
FROM node:12.13.0-alpine

WORKDIR /app

# Packages
COPY package*.json ./
RUN npm install

# Typescript
COPY ts*.json ./

# Folders
COPY src ./src

# Data folders
RUN mkdir ./data
RUN mkdir ./data/files

COPY data/files ./data/files

# Envs
ENV NODE_ENV development

# Port to expose
EXPOSE 3000

# Run script
CMD npm run start
