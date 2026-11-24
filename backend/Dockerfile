FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1
CMD ["node", "index.js"]
