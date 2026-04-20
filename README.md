# SitePet

Site do PET (Programa de Educação Tutorial) da Engenharia de Computação — UFES.

## Estrutura

- `backend/` — API REST (Node 18 + Express + Mongoose, MongoDB Atlas)
- `frontend/` — SPA React (build estático servido via `serve`)
- `docker-compose.yml` — composição local (builda a partir do código)
- `docker-compose.prod.yml` — composição de produção (consome imagens do GHCR)
- `.github/workflows/build-and-push.yml` — CI: builda e publica imagens no GHCR

## Como rodar localmente

Sem Docker:

```bash
# Backend (porta 3333)
cd backend && npm install && npm start

# Frontend (porta 3000)
cd frontend && yarn install && yarn start
```

Com Docker (builda a partir do código local):

```bash
docker compose up --build
```

Backend em http://localhost:3333 — Frontend em http://localhost:3000.

## Deploy

Fluxo de deploy em produção:

1. Faz alterações no código e dá push (ou merge de PR) na branch `main`.
2. O GitHub Actions (`.github/workflows/build-and-push.yml`) builda automaticamente em paralelo e publica no GHCR:
   - `ghcr.io/petengcomp/sitepet-backend:latest`
   - `ghcr.io/petengcomp/sitepet-frontend:latest`
   - Também publica `:sha-<short-hash>` para rastreabilidade e rollback.
3. No Portainer, abrir o stack do SitePet e clicar em **"Pull and redeploy"** para puxar as novas imagens `:latest` e reiniciar os containers.

O stack em produção usa `docker-compose.prod.yml`, que aponta para imagens do GHCR (não builda nada no servidor).

## Rollback

Cada commit em `main` gera uma tag `:sha-<short-hash>` no GHCR. Para voltar a uma versão anterior:

1. Identificar o SHA curto do commit alvo (`git log --oneline` ou pela aba **Packages** do GitHub).
2. No ambiente do stack no Portainer, definir a variável correspondente:
   - `BACKEND_TAG=sha-abc1234` para reverter só o backend
   - `FRONTEND_TAG=sha-abc1234` para reverter só o frontend
3. Fazer **"Pull and redeploy"** — o `docker-compose.prod.yml` usa `${BACKEND_TAG:-latest}` e `${FRONTEND_TAG:-latest}`, então a tag definida na variável tem prioridade sobre `:latest`.

Para voltar a usar `:latest`, apagar a variável (ou redefinir como `latest`) e redeployar.

## Variáveis de ambiente

### CI (GitHub Actions)

Configuradas em **Settings → Secrets and variables → Actions**:

- `REACT_APP_API_URL` (repository **variable**, não secret) — URL da API embutida no build do React. Se não definida, o Dockerfile usa o default `https://api.pet.inf.ufes.br/`.

Não há secrets adicionais: o workflow usa o `GITHUB_TOKEN` nativo para autenticar no GHCR.

### Stack de produção (Portainer)

Variáveis lidas pelo `docker-compose.prod.yml` via environment do stack:

- `DB_CONNECT` — connection string do MongoDB Atlas
- `TOKEN_SECRET` — segredo JWT
- `EMAIL` — endereço de envio (Gmail)
- `EMAIL_PASSWORD` — senha de app do Gmail
- `APIPET_URL` — hostname da API (ex: `api.pet.inf.ufes.br`), usado pelo Traefik
- `SITEPET_URL` — hostname do site (ex: `pet.inf.ufes.br`), usado pelo Traefik
- `REACTAPIPET_URL` — cosmético em runtime; o valor real foi compilado no build do React via `REACT_APP_API_URL` (TODO: remover futuramente)
- `TRAEFIK_NETWORK` — nome da rede Docker externa do Traefik
- `BACKEND_TAG` / `FRONTEND_TAG` — opcionais, usadas para rollback (default: `latest`)

## Documentação adicional

- API: ver [backend/README.md](backend/README.md)
