FROM node:18-alpine
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
EXPOSE 3333
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1
CMD ["node", "index.js"]
