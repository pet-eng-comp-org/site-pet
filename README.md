# SitePet

Site do PET (Programa de Educação Tutorial) da Engenharia de Computação — UFES.

## Estrutura

- `backend/` — API REST (Node 18 + Express + Mongoose, MongoDB Atlas)
- `frontend/` — Next (App Router) com TypeScript; o servidor do Next gera cada página a cada visita, já com os dados da API
- `docker-compose.yml` — composição local (builda a partir do código)
- `docker-compose.prod.yml` — a stack de produção: o Portainer aplica o que estiver aqui
- `.github/workflows/build-and-push.yml` — CI: builda e publica imagens no GHCR

## Como rodar localmente

O site inteiro (banco, API e o mesmo servidor de produção), para testar antes de abrir a PR:

```bash
docker compose up --build -d
```

Site em http://localhost:3000 e API em http://localhost:3333. O painel está em `/login`, com `admin@pet.local` e a senha `senha-local`: o banco começa só com essa conta (`dev/semente.js`) e guarda o que for cadastrado entre uma subida e outra. Para começar do zero, `docker compose down -v`.

Para mexer no front com recarga automática, com a API acima no ar:

```bash
cd frontend && yarn install && NEXT_PUBLIC_API_URL=http://localhost:3333/ yarn dev
```

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

- `NEXT_PUBLIC_API_URL` (repository **variable**, não secret) — URL da API embutida no build do front. Se não definida, o Dockerfile usa o default `https://api.pet.inf.ufes.br/`.

Não há secrets adicionais: o workflow usa o `GITHUB_TOKEN` nativo para autenticar no GHCR.

### Stack de produção (Portainer)

Variáveis da stack `site-pet`, lidas pelo `docker-compose.prod.yml`:

- `DB_CONNECT` — connection string do MongoDB Atlas
- `TOKEN_SECRET` — segredo JWT
- `EMAIL` — endereço de envio (Gmail)
- `EMAIL_PASSWORD` — senha de app do Gmail

## Documentação adicional

- API: ver [backend/README.md](backend/README.md)
