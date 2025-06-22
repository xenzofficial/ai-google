FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
# Gunakan proses manager untuk handle timeout
CMD ["npm", "start"]
