# SitePet

Site do PET (Programa de Educação Tutorial) da Engenharia de Computação — UFES.

## Estrutura

- `backend/` — API REST (Node 18 + Express + Mongoose, MongoDB Atlas)
- `frontend/` — SPA React (build estático servido via `serve`)
- `docker-compose.yml` — composição local (builda a partir do código)
- `docker-compose.prod.yml` — a stack de produção: o Portainer aplica o que estiver aqui
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

Merge na `main` implanta sozinho:

1. O GitHub Actions (`build-and-push.yml`) builda e publica no GHCR `ghcr.io/pet-eng-comp-org/site-pet/back-end` e `site-pet/front-end`, com a tag `:sha-<hash curto>`.
2. O job `implanta` escreve o digest novo no `docker-compose.prod.yml`, só do serviço cuja pasta mudou, e faz um commit `deploy:` na `main`.
3. O Portainer acompanha esse arquivo e aplica em até 5 minutos.

## Rollback

`git revert` do commit `deploy:` que se quer desfazer, e push na `main`. O Portainer volta para o digest anterior sozinho.

## Variáveis de ambiente

### CI (GitHub Actions)

Configuradas em **Settings → Secrets and variables → Actions**:

- `REACT_APP_API_URL` (repository **variable**, não secret) — URL da API embutida no build do React. Se não definida, o Dockerfile usa o default `https://api.pet.inf.ufes.br/`.

Não há secrets adicionais: o workflow usa o `GITHUB_TOKEN` nativo para autenticar no GHCR.

### Stack de produção (Portainer)

Variáveis da stack `site-pet`, lidas pelo `docker-compose.prod.yml`:

- `DB_CONNECT` — connection string do MongoDB Atlas
- `TOKEN_SECRET` — segredo JWT
- `EMAIL` — endereço de envio (Gmail)
- `EMAIL_PASSWORD` — senha de app do Gmail

## Documentação adicional

- API: ver [backend/README.md](backend/README.md)
