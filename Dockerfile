FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "--max-http-header-size=16384", "index.js"] # Handle headers besar
