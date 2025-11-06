# Use an FFmpeg base image
FROM jrottenberg/ffmpeg:6.0-ubuntu

# Install nginx for serving the output
RUN apt-get update && apt-get install -y nginx && mkdir -p /app/public/stream

# Copy configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

WORKDIR /app

# Expose HTTP port
EXPOSE 80

# Start the script
CMD ["/app/start.sh"]
