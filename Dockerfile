# Gunakan image Node.js resmi dengan versi spesifik
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files terlebih dahulu untuk caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua file aplikasi
COPY . .

# Expose port (sesuai dengan yang digunakan di aplikasi)
EXPOSE 8080

# Gunakan format CMD yang benar
CMD ["node", "index.js"]  # Tanpa kurung siku tambahan!
