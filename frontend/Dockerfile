# ---- Stage 1: build ----
FROM node:18-alpine AS builder
WORKDIR /usr/app

ARG REACT_APP_API_URL=https://api.pet.inf.ufes.br/
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

# ---- Stage 2: runtime ----
FROM node:18-alpine
WORKDIR /usr/app

RUN npm install -g serve

COPY --from=builder /usr/app/build ./build

USER node

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["serve", "-l", "80", "-s", "build"]
