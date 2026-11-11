# ---- Estágio 1: build ----
FROM node:22-alpine AS builder
WORKDIR /usr/app

# O endereço da API entra no build (NEXT_PUBLIC_): o navegador e o servidor
# usam o mesmo. Apontar para outra API exige reconstruir a imagem.
ARG NEXT_PUBLIC_API_URL=https://api.pet.inf.ufes.br/
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---- Estágio 2: execução ----
# Só o servidor mínimo que o Next gera (output: "standalone"), com os arquivos
# estáticos ao lado, sem o node_modules inteiro.
FROM node:22-alpine
WORKDIR /usr/app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=80 HOSTNAME=0.0.0.0

COPY --from=builder /usr/app/.next/standalone ./
COPY --from=builder /usr/app/.next/static ./.next/static
COPY --from=builder /usr/app/public ./public

USER node

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

# As páginas saem do servidor a cada visita, já com o texto e os dados da API.
CMD ["node", "server.js"]
