FROM node:18-alpine
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1
CMD ["node", "index.js"]
