# Dockerfile.alpine (simplified & fixed)
FROM node:18-alpine

# Install system dependencies including yt-dlp and ffmpeg
RUN apk update && apk add --no-cache \
      python3 \
      py3-pip \
      ffmpeg \
      curl \
      ca-certificates \
      yt-dlp \
    && update-ca-certificates \
    && rm -rf /var/cache/apk/*

# Create a non-root user (optional but recommended)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci --only=production

# Copy app code
COPY . .

# Create downloads directory and set ownership to non-root user
RUN mkdir -p /app/downloads && chown -R appuser:appgroup /app/downloads

# Switch to non-root user
USER appuser

# Expose port and default env
ENV PORT=5000
EXPOSE 5000

# Health check (ensure your app implements /health on the same PORT)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the app
CMD ["npm", "start"]
