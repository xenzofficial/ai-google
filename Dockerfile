# Gunakan image Node.js LTS
FROM node:18-alpine

# Buat direktori kerja
WORKDIR /app

# Salin package.json terlebih dahulu (untuk caching)
COPY package.json .

# Install dependencies
RUN npm install

# Salin semua file
COPY . .

# Expose port (sesuaikan dengan yang dipakai di index.js)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
