# Documentação da API

## Sumário

- [Processo Seletivo](#rotas-de-processo-seletivo)
  - [GET](#ps_get)
  - [POST](#ps_post)
  - [PUT](#ps_put)
  - [PATCH](#ps_patch)
  - [DELETE](#ps_delete)
- [Inscrições](#rotas-de-inscricoes)
  - [GET](#i_get)
  - [POST](#i_post)
  - [PATCH](#i_patch)
  - [DELETE](#i_delete)
- [Documentos](#rotas-de-documentos)
  - [GET](#d_get)
  - [POST](#d_post)
  - [PUT](#d_put)
  - [PATCH](#d_patch)
  - [DELETE](#d_delete)
- [Notícias](#rotas-de-noticias)
  - [GET](#n_get)
  - [POST](#n_post)
  - [PATCH](#n_patch)
  - [DELETE](#n_delete)
- [Login](#rotas-de-login)
  - [GET](#l_get)
  - [PATCH](#l_patch)
- [Arquivos](#rotas-de-arquivos)
  - [GET](#a_get)
  - [DELETE](#a_delete)
- [Contato](#rotas-de-contato)
  - [POST](#c_post)
- [Membros](#rotas-de-membros)
  - [GET](#m_get)
  - [POST](#m_post)
  - [PUT](#m_put)
  - [PATCH](#m_patch)
  - [DELETE](#m_delete)
- [Comissões](#rotas-de-comissões)
  - [GET](#cm_get)
  - [POST](#cm_post)
  - [PUT](#cm_put)
  - [PATCH](#cm_patch)
  - [DELETE](#cm_delete)
- [Projetos](#rotas-de-projetos)
  - [GET](#p_get)
  - [POST](#p_post)
  - [PUT](#p_put)
  - [DELETE](#p_delete)

## Rotas de Processo Seletivo

### ps_GET

```js
router.get("/", verify, selectionController.index);
```

**Descrição:**

- Lista todos os processos seletivos cadastrados no banco, juntamente com os inscritos nele.

**URL:**

- `localhost:3333/api/selection/`

**Parametros esperados:**

- Token de validação que deve ser passado no header.

**Retorno:**

- Lista de todos os processos seletivos cadastrados no banco.

======= || =======

```js
router.get("/openSelection", selectionController.openSelection);
```

**Descrição:**

- Lista o processo seletivo que está aberto.

**URL:**

- `localhost:3333/api/selection/openSelection`

**Parametros esperados:**

- Nenhum

**Retorno:**

- O processo seletivo que está aberto.

======= || =======

```js
router.get("/:id", verify, selectionController.show);
```

**Descrição:**

- Lista um processo seletivo específico.

**URL:**

- `localhost:3333/api/selection/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do processo seletivo deve ser passado pela própria URL. Ex: `localhost:3333/api/selection/0as87dashd7`

**Retorno:**

- Retorna o processo seletivo que possui o id passado na URL.

### ps_POST

```js
router.post("/", verify, selectionController.store);
```

**Descrição:**

- Cadastra novo processo seletivo no banco, por padrão ele ja é cadastrado como aberto, e só é possível cadastrar esse novo processo, caso não existam outros processos seletivos abertos.

**URL:**

- `localhost:3333/api/selection/`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- Body do tipo JSON com os campos `title` e `phases`. Exemplo de como deve ser o campo `phases` está abaixo.
  **Obs:** o campo `date` é do tipo Date, então não é necessário que seja exatamente daquela forma, apenas de uma forma que seja compativel com o tipo Date.

```json
"phases": [
  {"date": "07/15/2020 10:00:00", "local": "CT7 - 101"},
  {"date": "08/06/2020 08:00:00", "local": "CT9 - 208"}
]
```

**Retorno:**

- Caso tudo ocorra bem, será retornado o id do novo processo seletivo, caso contrário, uma mensagem descrevendo o que houve de errado.

### ps_PUT

```js
router.put("/:id", verify, selectionController.update);
```

**Descrição:**

- Edita os campos `title` e `phases` de um processo seletivo que já esta no banco.

**URL:**

- `localhost:3333/api/selection/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do processo seletivo que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/selection/0as87dashd7`
- Body do tipo JSON com os campos `title` e `phases`. Exemplo de como deve ser o campo `phases` está abaixo.
  **Obs:** o campo `date` é do tipo Date, então não é necessário que seja exatamente daquela forma, apenas de uma forma que seja compativel com o tipo Date.

```json
"phases": [
  {"date": "07/15/2020 10:00:00", "local": "CT7 - 101"},
  {"date": "08/06/2020 08:00:00", "local": "CT9 - 208"}
]
```

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

### ps_PATCH

```js
router.patch(
  "/removeInscription/:id",
  verify,
  selectionController.removeInscription
);
```

**Descrição:**

- Remove uma inscrição do processo seletivo, a rota também remove a inscrição e seus arquivos do banco, é esta rota que deve ser usada para excluir uma inscrição que está em algum processo seletivo.

**URL:**

- `localhost:3333/api/selection/removeInscription/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do processo seletivo que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/selection/removeInscription/0as87dashd7`
- Body do tipo JSON com o campo `idInscription`.

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

======= || =======

```js
router.patch("/finalizeSelection/:id", verify, selectionController.finalize);
```

**Descrição:**

- Altera o campo `open` de um processo seletivo para false, além disso, exclui todos os arquivos dos inscritos naquele processo seletivo para liberar espaço no servidor, mas as outras informações
  de inscritos permanecem.

**URL:**

- `localhost:3333/api/selection/finalizeSelection/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do processo seletivo que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/selection/finalizeSelection/0as87dashd7`

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

### ps_DELETE

```js
router.delete("/:id", verify, selectionController.destroy);
```

**Descrição:**

- Deleta um processo seletivo e seus inscritos do banco. Só é possivel excluir processos seletivos que foram finalizados.

**URL:**

- `localhost:3333/api/selection/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do processo seletivo que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/selection/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

## Rotas de Inscrições

### i_GET

```js
router.get("/", verify, inscriptionsController.index);
```

**Descrição:**

- Lista todas as inscrições cadastradas no banco.

**URL:**

- `localhost:3333/api/inscriptions/`

**Parametros esperados:**

- Token de validação que deve ser passado no header.

**Retorno:**

- Lista de todas as inscrições cadastradas no banco.

======= || =======

```js
router.get("/:id", verify, inscriptionsController.show);
```

**Descrição:**

- Lista uma inscrição específica.

**URL:**

- `localhost:3333/api/inscriptions/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da inscrição que deseja-se obeter deve ser passado pela propria URL, Ex: `localhost:3333/api/inscriptions/53bsd2n`

**Retorno:**

- A inscrição que possui o id passado pela URL, caso a mesma exista.

### i_POST

```js
router.post(
  "/",
  multer(multerConfig("zip")).single("file"),
  inscriptionsController.store
);
```

**Descrição:**

- Cadastra uma nova inscrição no banco, e vincula a mesma no processo seletivo que está aberto. Só é possivel cadastrar novas inscrições caso existam processos seletivos abertos.

**URL:**

- `localhost:3333/api/inscriptions/`

**Parametros esperados:**

- Body do tipo multipart-form com os campos `name`, `email`, `phone` e `file`.

**Retorno:**

- Caso tudo ocorra bem, será retornado o id da nova inscrição, caso contrário, uma mensagem descrevendo o que houve de errado.

### i_PATCH

```js
router.patch(
  "/acceptInscription/:id",
  verify,
  inscriptionsController.updateInscription
);
```

**Descrição:**

- Altera o estado de `accept` de uma inscrição

**URL:**

- `localhost:3333/api/inscriptions/acceptInscription/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da inscrição que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/inscriptions/acceptInscriptions/53bsd2n`.
- Body do tipo json com o campo `accept`.

**Retorno:**

- Caso tudo ocorra bem, será retornado uma mensagemd e sucesso, caso contrário, uma mensagem descrevendo o que houve de errado.

### i_DELETE

```js
router.delete("/:id", verify, inscriptionsController.destroy);
```

**Descrição:**

- Deleta uma inscrição específica do banco.

**URL:**

- `localhost:3333/api/inscriptions/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da inscrição que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/inscriptions/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado a inscrição que foi deletada, caso contrário, uma mensagem descrevendo o que houve de errado.

## Rotas de Documentos

### d_GET

```js
router.get("/", documentsController.index);
```

**Descrição:**

- Lista todos os documentos cadastrados no banco.

**URL:**

- `localhost:3333/api/documents/`

**Parametros esperados:**

- Nenhum

**Retorno:**

- Lista de todos os documentos cadastrados no banco.

======= || =======

```js
router.get("/:id", documentsController.show);
```

**Descrição:**

- Lista um documento específico.

**URL:**

- `localhost:3333/api/documents/:id`

**Parametros esperados:**

- id do documento que deseja-se obeter deve ser passado pela propria URL, Ex: `localhost:3333/api/documents/53bsd2n`

**Retorno:**

- O documento que possui o id passado pela URL, caso o mesmo exista.

### d_POST

```js
router.post("/", verify, documentsController.store);
```

**Descrição:**

- Cadastra um novo documento no banco.

**URL:**

- `localhost:3333/api/documents/`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- Body do tipo JSON com o campo `title`.

**Retorno:**

- Caso tudo ocorra bem, será retornado o id do novo documento, caso contrário, uma mensagem descrevendo o que houve de errado.

### d_PUT

```js
router.put("/:id", verify, documentsController.update);
```

**Descrição:**

- Altera o campo `title` de um documento

**URL:**

- `localhost:3333/api/documents/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do documento que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/documents/53bsd2n`.
- Body do tipo json com o campo `title`.

**Retorno:**

- Caso tudo ocorra bem, será retornado o documento alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

### d_PATCH

```js
router.patch(
  "/addFile/:id",
  verify,
  multer(multerConfig("pdf")).single("file"),
  documentsController.addFile
);
```

**Descrição:**

- Adiciona um novo arquivo na lista de um documento específico.

**URL:**

- `localhost:3333/api/documents/addFile/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- Body do tipo multipart-form com o campo `file`.
- id do documento que deseja-se adicionar um novo arquivo deve ser passado pela propria URL, Ex: `localhost:3333/api/documents/addFile/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado o documento alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

======= || =======

```js
router.patch("/removeFile/:id", verify, documentsController.removeFile);
```

**Descrição:**

- Remove um arquivo de um documento específico.

**URL:**

- `localhost:3333/api/documents/removeFile/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- Body do tipo JSON com o campo `fileId`
- id do documento que deseja-se remover um arquivo deve ser passado pela propria URL, Ex: `localhost:3333/api/documents/removeFile/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado o documento alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

### d_DELETE

```js
router.delete("/:id", verify, documentsController.destroy);
```

**Descrição:**

- Deleta um documento e todos os seus arquivos do banco.

**URL:**

- `localhost:3333/api/documents/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do documento que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/documents/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado o documento que foi deletado, caso contrário, uma mensagem descrevendo o que houve de errado.

## Rotas de Notícias

### n_GET

```js
router.get("/", newsController.index);
```

**Descrição:**

- Lista todas as notícias cadastradas no banco.

**URL:**

- `localhost:3333/api/news/`

**Parametros esperados:**

- Token de validação que deve ser passado no header.

**Retorno:**

- Lista de todas as notícias cadastradas no banco.

======= || =======

```js
router.get("/:id", newsController.show);
```

**Descrição:**

- Lista uma notícia específica.

**URL:**

- `localhost:3333/api/news/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da notícia que deseja-se obeter deve ser passado pela propria URL, Ex: `localhost:3333/api/news/53bsd2n`

**Retorno:**

- A notícia que possui o id passado pela URL, caso a mesma exista.

### n_POST

```js
router.post("/", verify, newsController.store);
```

**Descrição:**

- Cadastra uma nova notícia no banco.

**URL:**

- `localhost:3333/api/news/`

**Parametros esperados:**

- Body do tipo multipart-form com os campos `title`, `text` e `file`.

**Retorno:**

- Caso tudo ocorra bem, será retornado o id da nova notícia, caso contrário, uma mensagem descrevendo o que houve de errado.

### n_PATCH

```js
router.patch("/updateTexts/:id", verify, newsController.updateTexts);
```

**Descrição:**

- Altera os campos do tipo string de uma notícia que ja foi cadastrada.

**URL:**

- `localhost:3333/api/news/updateTexts/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da notícia que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/news/updateTexts/53bsd2n`
- Body do tipo JSON com os campos `title` e `text`.
- Todos os campos devem estar preenchidos com as informações finais da notícia.

**Retorno:**

- Caso tudo ocorra bem, será retornado uma mensagem de sucesso, caso contrário, uma mensagem descrevendo o que houve de errado.

======= || =======

```js
router.patch(
  "/updateImage/:id",
  verify,
  multer(multerConfig("news")).single("file"),
  newsController.updateImage
);
```

**Descrição:**

- Altera a imagem de uma notícia que ja foi cadastrada.

**URL:**

- `localhost:3333/api/news/updateImage/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da notícia que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/news/updateTexts/53bsd2n`
- Body do tipo multipart-form com o campo `file`.

**Retorno:**

- Caso tudo ocorra bem, será retornado uma mensagem de sucesso, caso contrário, uma mensagem descrevendo o que houve de errado.

### n_DELETE

```js
router.delete("/:id", verify, newsController.destroy);
```

**Descrição:**

- Deleta uma notícia específica do banco.

**URL:**

- `localhost:3333/api/news/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da notícia que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/news/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado a notícia que foi deletada, caso contrário, uma mensagem descrevendo o que houve de errado.

## Rotas de Login

### l_GET

```js
router.get("/", loginController.login);
```

**Descrição:**

- Cria um token para a sessão de um petiano.

**URL:**

- `localhost:3333/api/login/`

**Parametros esperados:**

- Credenciais do petiano devem der passados pelo header [dessa forma](https://pt.stackoverflow.com/questions/323579/axios-basic-auth-como-passar-usuario-e-senha-para-a-api).

**Retorno:**

- Caso as credenciais do petiano estejam corretas, retorna um token válido, caso contrário, uma mensagem descrevendo o que houve de errado.

### l_PATCH

```js
router.patch("/forgotPassword", loginController.forgotPassword);
```

**Descrição:**

- Envia um email para o petiano que esqueceu sua senha com uma nova senha.

**URL:**

- `localhost:3333/api/login/forgotPassword`

**Parametros esperados:**

- Body do tipo JSON com o campo `email` do petiano que está cadastrado.

**Retorno:**

- Caso o email seja encontrado no banco de dados, é enviado uma nova senha de acesso para o petiano.

======= || =======

```js
router.patch("/changePassword", verify, loginController.newPassword);
```

**Descrição:**

- Altera a senha cadastrada de um petiano.

**URL:**

- `localhost:3333/api/login/changePassword`

**Parametros esperados:**

- Body do tipo JSON com o campo `email`, `password` e `newPassword`.

**Retorno:**

- Caso o email seja encontrado no banco de dados e a senha antiga corresponda à q está cadastrada, a senha do petiano é alterada.

## Rotas de Arquivos

### a_GET

```js
router.get("/", fileController.index);
```

**Descrição:**

- Lista todos os arquivos cadastrados no banco.

**URL:**

- `localhost:3333/api/file/`

**Parametros esperados:**

- Nenhum.

**Retorno:**

- Lista de todos os arquivos cadastrados no banco.

======= || =======

```js
router.get("/downloadDocument/:fileId", fileController.downloadDocument);
```

**Descrição:**

- Retorna o arquivo de um documento do PET específico que está cadastrado no banco, para que o download do mesmo possa ser efetuado.

**URL:**

- `localhost:3333/api/file/downloadDocument/:fileId`

**Parametros esperados:**

- id do campo `file` do documento que deseja-se fazer o download deve ser passado pela propria URL. Ex: `localhost:3333/api/file/downloadDocument/53bsd2n`

```json
{
  "_id": "5ea46187ab1b8825fa6ad89b",
  "owner": "Molibe",
  "file": {
    "_id": "5ea46187ab1b8825fa6ad89a", esse é o campo que deve ser passado
    "name": "Android-introducao.pdf",
    "size": 3015686,
    "key": "dbe32b8dbc64f0bb6f81b67427cd4e9d-Android-introducao.pdf",
    "createdAt": "2020-04-25T18:11:14.160Z",
    "__v": 0
  },
  "__v": 0
}
```

**Retorno:**

- O arquivo que foi solicitado.

======= || =======

```js
router.get(
  "/downloadInscription/:fileId",
  verify,
  fileController.downloadInscription
);
```

**Descrição:**

- Retorna o arquivo de uma inscrição específica que está cadastrado no banco, para que o download do mesmo possa ser efetuado.

**URL:**

- `localhost:3333/api/file/downloadInscription/:fileId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do campo `file` da inscrição que deseja-se fazer o download deve ser passado pela propria URL. Ex: `localhost:3333/api/file/downloadInscription/53bsd2n`

```json
{
  "accepted": false,
  "_id": "5eaa0991415a907122286841",
  "name": "Henrique",
  "email": "henrique@email.com",
  "phone": "28999999999",
  "file": {
    "_id": "5eaa0990415a907122286840",    esse é o campo que deve ser passado
    "name": "arquivos.zip",
    "size": 288250,
    "key": "bb982e16c8216dc451894935138d455b-arquivos.zip",
    "createdAt": "2020-04-29T23:11:12.882Z",
    "__v": 0
  },
  "__v": 0
}
```

**Retorno:**

- O arquivo que foi solicitado.

======= || =======

```js
router.get("/getImageNews/:fileId", fileController.getImageNews);
```

**Descrição:**

- Retorna a imagem de uma noticia específica que está cadastrado no banco, para que a mesma possa ser mostrada no frontend.

**URL:**

- `localhost:3333/api/file/getImageNews/:fileId`

**Parametros esperados:**

- id do campo `file` da noticia que deseja-se fazer o download deve ser passado pela propria URL. Ex: `localhost:3333/api/file/getImageNews/53bsd2n`

```json
{
  "new": {
    "_id": "5eb4123c5e447328516ee00c",
    "title": "asndankjs",
    "file": {
      "_id": "5eb4123c5e447328516ee00b",    esse é o campo que deve ser passado
      "name": "503-200x300.jpg",
      "size": 13132,
      "key": "881c3a8fbc5ef8e64591c250e2e5a138-503-200x300.jpg",
      "createdAt": "2020-05-07T13:50:52.143Z",
      "__v": 0
    },
    "text": "kljakjsdkjasnkjdaskjdasnkjdas",
    "date": "2020-05-07T13:50:52.295Z",
    "__v": 0
  }
}
```

**Retorno:**

- A imagem que foi solicitada.

======= || =======

```js
router.get("/getProfilePhoto/:fileId", fileController.getProfilePhoto);
```

**Descrição:**

- Retorna a imagem de perfil de um membro.

**URL:**

- `localhost:3333/api/file/getProfilePhoto/:fileId`

**Parametros esperados:**

- id do campo `profilePhoto` do membro que deseja-se fazer o download deve ser passado pela propria URL. Ex: `localhost:3333/api/file/getProfilePhoto/53bsd2n`

```json
{
  "active": true,
  "tutor": false,
  "_id": "5fe0fb0f6aa33d001255e686",
  "memberName": "Bruno Angeloti Pires",
  "description": "É um cara muito legal.",
  "startPet": "2020-08-10T00:00:00.000Z",
  "socialMidia": [],
  "tags": [],
  "__v": 0,
  "profilePhoto": {
    "_id": "5fe0fb106aa33d001255e68b",    esse é o campo que deve ser passado
    "name": "bruno-min.png",
    "size": 213423,
    "key": "4e3c4f36e54c114b5b25d8261750e4f1-bruno-min.png",
    "createdAt": "2020-12-21T19:44:16.811Z",
    "__v": 0
  }
},
```

**Retorno:**

- A imagem que foi solicitada.

======= || =======

```js
router.get("/getComissionPhoto/:fileId", fileController.getComissionPhoto);
```

**Descrição:**

- Retorna a imagem de perfil de um membro.

**URL:**

- `localhost:3333/api/file/getComissionPhoto/:fileId`

**Parametros esperados:**

- id de uma das `pothos` do membro que deseja-se fazer o download deve ser passado pela propria URL. Ex: `localhost:3333/api/file/getComissionPhoto/53bsd2n`

```json
{
  "project": [],
  "photos": [   um desses ids que deve ser passado
    "5fdb82d96aa33d001255e662",
    "5fdb82da6aa33d001255e663",
    "5fdb82da6aa33d001255e664",
    "5fdb82da6aa33d001255e665",
    "5fdb82da6aa33d001255e667",
    "5fdb82da6aa33d001255e666"
  ],
  "_id": "5fdb82d96aa33d001255e661",
  "title": "Introcomp",
  "description": "O projeto Introcomp – Introdução à Computação.",
  "tags": [],
  "__v": 0
},
```

**Retorno:**

- A imagem que foi solicitada.

### a_DELETE

```js
router.delete("/:fileId", verify, fileController.destroy);
```

**Descrição:**

- Deleta qualquer arquivo do banco de dados, (não deleta o arquivo do servidor).

**URL:**

- `localhost:3333/api/file/:fileId`

**Parametros esperados:**

- id do arquivo que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/file/53bsd2n`

**Retorno:**

- Caso tudo tenha dado certo, uma mensagem mostrando que deu certo, caso contrário, uma mensagem de erro dizendo o que houve de errado.

## Rotas de Contato

### c_POST

```js
router.post("/", contactContoller.sendEmail);
```

**Descrição:**

- Envia um email para o email do PET com a mensagem que o usuário quiser.

**URL:**

- `localhost:3333/api/contact/`

**Parametros esperados:**

- Body json com os campos `name`, `subject` e `text`.

**Retorno:**

- Caso tudo ocorra bem, será retornado o objeto criado para o envio do email, caso contrário, uma mensagem descrevendo o que houve de errado.

## Rotas de Membros

### m_GET

```js
router.get("/", memberController.index);
```

**Descrição:**

- Lista todas os membros cadastrados no banco.

**URL:**

- `localhost:3333/api/members/`

**Parametros esperados:**

- Nenhum.

**Retorno:**

- Lista de todos os membros cadastrados no banco.

======= || =======

```js
router.get("/all/", verify, memberController.indexAll);
```

**Descrição:**

- Lista todas os membros cadastrados no banco, e todas as suas informações.

**URL:**

- `localhost:3333/api/members/all/`

**Parametros esperados:**

- Token de validação que deve ser passado no header.

**Retorno:**

- Lista de todos os membros cadastrados no banco.

======= || =======

```js
router.get("/:memberId", verify, memberController.show);
```

**Descrição:**

- Lista todas as informações de um membro específico.

**URL:**

- `localhost:3333/api/members/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se obter deve ser passado pela propria URL, Ex: `localhost:3333/api/members/53bsd2n`

**Retorno:**

- O membro que possui o id passado pela URL, caso o mesmo exista.

======= || =======

```js
router.get("/showEgress", memberController.showEgress);
```

**Descrição:**

- Lista todas os membros egressos cadastrados no banco.

**URL:**

- `localhost:3333/api/members/showEgress`

**Parametros esperados:**

- Nenhum.

**Retorno:**

- Lista de todos os membros egressos cadastrados no banco.

======= || =======

```js
router.get("/showEgressAll", memberController.index);
```

**Descrição:**

- Lista todas os membros egressos cadastrados no banco, e todas as suas informações.

**URL:**

- `localhost:3333/api/members/showEgressAll`

**Parametros esperados:**

- Token de validação que deve ser passado no header.

**Retorno:**

- Lista de todos os membros egressos cadastrados no banco.

### m_POST

```js
router.post("/", verify, memberController.store);
```

**Descrição:**

- Cadastra um novo membro no banco.

**URL:**

- `localhost:3333/api/members/`

**Parametros esperados:**

- Body do tipo JSON com os campos `memberName`, `description`, `email`, `password`, `phone`, `startPet`, `active`, `socialMidia` e `tags`.
- Abaixo está um exemplo de como devem ser os campos `socialMidia` e `tags`.

```json
"socialMidia": [
  {
    "_id": "5fe0fb0f6aa33d001255e687",
    "name": "instagram", //atualmente o front comporta [facebook, instagram, twitter, linkedin, twitch, youtube]
    "link": "https://www.instagram.com/bruno_angeloti/?hl=pt-br"
  },
],
"tags": [
  {
    "_id": "5fe0fb0f6aa33d001255e68a",
    "title": "EletroPET",
    "color": "#FFFFFF",
    "backgroundColor": "#2fce77"
  },
]
```

**Retorno:**

- Caso tudo ocorra bem, será retornado o id do novo membro, caso contrário, uma mensagem descrevendo o que houve de errado.

### m_PUT

```js
router.put("/:memberId", verify, memberController.update);
```

**Descrição:**

- Edita os campos `memberName`, `description`, `email`, `password`, `phone`, `startPet`, `active`, `socialMidia` e `tags` de um membro que já esta no banco.

**URL:**

- `localhost:3333/api/members/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/members/0as87dashd7`
- Body do tipo JSON com os campos `memberName`, `description`, `email`, `password`, `phone`, `startPet`, `endPet`, `active`, `socialMidia` e `tags`.
- Abaixo está um exemplo de como devem ser os campos `socialMidia` e `tags`.

```json
"socialMidia": [
  {
    "_id": "5fe0fb0f6aa33d001255e687",
    "name": "instagram", //atualmente o front comporta [facebook, instagram, twitter, linkedin, twitch, youtube]
    "link": "https://www.instagram.com/bruno_angeloti/?hl=pt-br"
  },
],
"tags": [
  {
    "_id": "5fe0fb0f6aa33d001255e68a",
    "title": "EletroPET",
    "color": "#FFFFFF",
    "backgroundColor": "#2fce77"
  },
]
```

**Retorno:**

- Caso tudo ocorra bem,será retornado uma mensagem de sucesso, caso contrário, uma mensagem descrevendo o que houve de errado.

### m_PATCH

```js
router.patch("/sairDoPet/:memberId", verify, memberController.sairDoPet);
```

**Descrição:**

- Altera o campo `active` para falso, deleta o campo `description` e solicita nova data para `endPet` pelo body, de um membro que acabou de sair do PET.

**URL:**

- `localhost:3333/api/members/sairDoPet/:memberid`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/members/sairDoPet/53bsd2n`
- Body do tipo JSON com o campo `endPet`.

**Retorno:**

- Caso tudo ocorra bem, será retornado uma mensagem de sucesso, caso contrário, uma mensagem descrevendo o que houve de errado.

======= || =======

```js
router.patch(
  "/firstProfilePhoto/:memberId",
  verify,
  multer(multerConfig("members")).single("profilePhoto"),
  memberController.firstProfilePhoto
);
```

**Descrição:**

- Insere a primeira imagem de perfil de um membro que ja foi cadastrado.

**URL:**

- `localhost:3333/api/members/firstProfilePhoto/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se adicionar a imagem deve ser passado pela propria URL, Ex: `localhost:3333/api/members/firstProfilePhoto/53bsd2n`
- Body do tipo multipart-form com o campo `profilePhoto`.

**Retorno:**

- Caso tudo ocorra bem, será retornado as informações sobre o membro que foi alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

======= || =======

```js
router.patch(
  "/updateProfilePhoto/:memberId",
  verify,
  multer(multerConfig("members")).single("profilePhoto"),
  memberController.updateProfilePhoto
);
```

**Descrição:**

- Altera a imagem de perfil de um membro que ja foi cadastrado.

**URL:**

- `localhost:3333/api/members/updateProfilePhoto/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/members/updateProfilePhoto/53bsd2n`
- Body do tipo multipart-form com o campo `profilePhoto`.

**Retorno:**

- Caso tudo ocorra bem, será retornado as informações sobre o membro que foi alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

### m_DELETE

```js
router.delete("/:memberId", verify, memberController.delete);
```

**Descrição:**

- Deleta um membro específico do banco e todas as suas informações.

**URL:**

- `localhost:3333/api/members/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/members/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será mostrado as informações do membro deletado, caso contrário, uma mensagem descrevendo o que houve de errado.

## Rotas de Comissões

### cm_GET

```js
router.get("/", comissionController.index);
```

**Descrição:**

- Lista todas as comissões cadastradas no banco.

**URL:**

- `localhost:3333/api/comissions/`

**Parametros esperados:**

- Nenhum.

**Retorno:**

- Lista de todas as comissões cadastrados no banco.

======= || =======

```js
router.get("/:comissionId", comissionController.show);
```

**Descrição:**

- Lista a comissão que possui o id passado na URL.

**URL:**

- `localhost:3333/api/comissions/openSelection`

**Parametros esperados:**

- id da comissão que deseja-se obter deve ser passado pela propria URL, Ex: `localhost:3333/api/comissions/53bsd2n`

**Retorno:**

- Retorna a comissão que possui o id especificado, caso exista.

### cm_POST

```js
router.post("/", verify, comissionController.store);
```

**Descrição:**

- Cadastra uma nova comissão.

**URL:**

- `localhost:3333/api/comissions/`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- Body do tipo JSON com os campos `title`, `description` e `tags`. Exemplo de como deve ser o campo `tags` está abaixo.

```json
"tags": [
  {
    "title": "ReactJS",
    "color": "#ffffff",
    "backgroundColor": "#5ed3f3"
  }
]
```

**Retorno:**

- Caso tudo ocorra bem, será retornado o id da nova comissão, caso contrário, uma mensagem descrevendo o que houve de errado.

### cm_PUT

```js
router.put("/:comissionId", verify, comissionController.update);
```

**Descrição:**

- Edita os campos `title`, `description` e `tags` de um processo seletivo que já esta no banco.

**URL:**

- `localhost:3333/api/comissions/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do processo seletivo que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/comissions/0as87dashd7`
- Body do tipo JSON com os campos `title`, `description` e `tags`. Exemplo de como deve ser o campo `tags` está abaixo.

```json
"tags": [
  {
    "title": "ReactJS",
    "color": "#ffffff",
    "backgroundColor": "#5ed3f3"
  }
]
```

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

### cm_PATCH

```js
router.patch(
  "/insertProject/:comissionId",
  verify,
  comissionController.insertProject
);
```

**Descrição:**

- Insere um projeto dentro de uma comissão.

**URL:**

- `localhost:3333/api/comissions/insertProject/:comissionId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da comissão que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/comissions/insertProject/0as87dashd7`
- Body do tipo JSON com o campo `projectId`.

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

======= || =======

```js
router.patch(
  "/removeProject/:comissionId",
  verify,
  comissionController.removeProject
);
```

**Descrição:**

- Retira um projeto de uma comissão.

**URL:**

- `localhost:3333/api/comissions/removeProject/:comissionId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da comissão que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/comissions/removeProject/0as87dashd7`

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

======= || =======

```js
router.patch(
  "/addPhoto/:comissionId",
  verify,
  multer(multerConfig("comissions")).single("photo"),
  comissionController.addPhoto
);
```

**Descrição:**

- Adiciona uma nova foto à comissão.

**URL:**

- `localhost:3333/api/comissions/addPhoto/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da comissão que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/comissions/addPhoto/0as87dashd7`
- Body do tipo multipart-form com o campo `photo`.

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

======= || =======

```js
router.patch(
  "/removePhoto/:comissionId",
  verify,
  comissionController.removePhoto
);
```

**Descrição:**

- Remove uma foto da comissão.

**URL:**

- `localhost:3333/api/comissions/removePhoto/:comissionId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da comissão que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/comissions/removePhoto/0as87dashd7`
- Body do tipo JSON com o campo `photoId`

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

### cm_DELETE

```js
router.delete("/:comissionId", verify, comissionController.delete);
```

**Descrição:**

- Deleta um comissão e suas fotos do banco.

**URL:**

- `localhost:3333/api/comissions/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id da comissão que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/comissions/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

## Rotas de Projetos

### p_GET

```js
router.get("/", projectController.index);
```

**Descrição:**

- Lista todos os projetos cadastrados no banco.

**URL:**

- `localhost:3333/api/projects/`

**Parametros esperados:**

- Nenhum

**Retorno:**

- Lista de todos os projetos cadastrados no banco.

### p_POST

```js
router.post("/", verify, projectController.store);
```

**Descrição:**

- Cadastra um novo projeto no banco.

**URL:**

- `localhost:3333/api/projects/`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- Body do tipo JSON com os campos `title`, `description` e `link`.

**Retorno:**

- Caso tudo ocorra bem, será retornado o id do novo projeto, caso contrário, uma mensagem descrevendo o que houve de errado.

### p_PUT

```js
router.put("/:projectId", verify, projectController.update);
```

**Descrição:**

- Altera o campo `title`, `description` e `link` de um projeto

**URL:**

- `localhost:3333/api/projects/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do projeto que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/projects/53bsd2n`.
- Body do tipo JSON com os campos `title`, `description` e `link`.

**Retorno:**

- Caso tudo ocorra bem, será retornado o projeto alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

### p_DELETE

```js
router.delete("/:projectId", verify, projectController.delete);
```

**Descrição:**

- Deleta um projeto do banco.

**URL:**

- `localhost:3333/api/projects/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do projeto que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/projects/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado o projeto que foi deletado, caso contrário, uma mensagem descrevendo o que houve de errado.

## Considerações

### Middleware verify

As rotas que possuem um `verify`, por exemplo, `router.get("/", verify, inscriptionsController.index)`,
o token deve ser passado pelo header [dessa forma](https://www.schoolofnet.com/forum/topico/configurando-a-autenticacao-com-o-axios-1616).

### Envio de arquivos

- Os arquivos de documentos do PET devem estar no formato de PDF.
- Os arquivos de documentos das inscrições devem estar compactados em formato ZIP.

### Tipo de imagens suportadas no Backend

- jpeg
- jpg
- png
- gif
- svg

### Envio de fotos dos membros

-

### Deletar inscrições

**NÃO** deletar inscrições que estejam dentro de um processo seletivo pela rota `api/inscriptions/:id`, para fazer isso utilize a rota
`api/selection/removeInscription/:id`, a primera rota funcionará perfeitamente para o caso de algum erro e a inscrição não esteja
vinculada a nenhum processo selevito.
