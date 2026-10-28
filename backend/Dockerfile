FROM node:24-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1
CMD ["node", "index.js"]
