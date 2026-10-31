# ---- Stage 1: build ----
FROM node:22-alpine AS builder
WORKDIR /usr/app

ARG VITE_API_URL=https://api.pet.inf.ufes.br/
ENV VITE_API_URL=$VITE_API_URL

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---- Stage 2: runtime ----
FROM node:22-alpine
WORKDIR /usr/app

COPY --from=builder /usr/app/build ./build
COPY --from=builder /usr/app/build-ssr ./build-ssr
COPY --from=builder /usr/app/server ./server
COPY --from=builder /usr/app/package.json ./

USER node

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# As páginas saem do servidor a cada visita, já com o texto e os dados da API
# (server/servidor.js); os arquivos do build, dele também.
CMD ["node", "server/servidor.js"]
