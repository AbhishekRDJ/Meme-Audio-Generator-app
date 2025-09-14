FROM node:18-alpine

# Install system dependencies including Python and yt-dlp
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    curl \
    && pip3 install --upgrade pip \
    && pip3 install yt-dlp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create downloads directory
RUN mkdir -p downloads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
