# Documentação da API

## Rotas de Processo Seletivo

### GET

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

### POST

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
    "phases": [{"date": "07/15/2020 10:00:00", "local": "CT7 - 101"},
			   {"date": "08/06/2020 08:00:00", "local": "CT9 - 208"}]
```

**Retorno:**

- Caso tudo ocorra bem, será retornado o id do novo processo seletivo, caso contrário, uma mensagem descrevendo o que houve de errado.

### PUT

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
    "phases": [{"date": "07/15/2020 10:00:00", "local": "CT7 - 101"},
			   {"date": "08/06/2020 08:00:00", "local": "CT9 - 208"}]
```

**Retorno:**

- Caso tudo ocorra bem, será retornado um JSON mostrando que deu certo, caso contrário, uma mensagem descrevendo o que houve de errado.

### PATCH

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

### DELETE

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

### GET

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

### POST

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
  [Aqui](https://github.com/HenriqueCruz5341/UFES/blob/18123a7950d42a8a4b1c895193d4ef46a2fa6026/web/sitePet/web/src/App.js#L51) está um exemplo de como deve ser mais ou menos.

**Retorno:**

- Caso tudo ocorra bem, será retornado o id da nova inscrição, caso contrário, uma mensagem descrevendo o que houve de errado.

### DELETE

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

### PATCH

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

## Rotas de Documentos

### GET

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

### POST

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

### PATCH

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
  [Aqui](https://github.com/HenriqueCruz5341/UFES/blob/18123a7950d42a8a4b1c895193d4ef46a2fa6026/web/sitePet/web/src/App.js#L51) está um exemplo de como deve ser mais ou menos.
- id do documento que deseja-se adicionar um novo arquivo deve ser passado pela propria URL, Ex: `localhost:3333/api/documents/addFile/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado o documento alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

```js
router.patch("/removeFile/:id", verify, documentsController.removeFile);
```

**Descrição:**

- Remove um arquivo de um documento específico.

**URL:**

- `localhost:3333/api/documents/removeFile/:id`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- Body do tipo JSON com o campo `idFile`
- id do documento que deseja-se remover um arquivo deve ser passado pela propria URL, Ex: `localhost:3333/api/documents/removeFile/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será retornado o documento alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

### PUT

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

### DELETE

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

- Caso tudo ocorra bem, será retornado o documento que foi deletada, caso contrário, uma mensagem descrevendo o que houve de errado.

## Rotas de Notícias

### GET

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

### POST

```js
router.post("/", verify, newsController.store);
```

**Descrição:**

- Cadastra uma nova notícia no banco.

**URL:**

- `localhost:3333/api/news/`

**Parametros esperados:**

- Body do tipo multipart-form com os campos `title`, `text` e `file`.
  [Aqui](https://github.com/HenriqueCruz5341/UFES/blob/18123a7950d42a8a4b1c895193d4ef46a2fa6026/web/sitePet/web/src/App.js#L51) está um exemplo de como deve ser mais ou menos.

**Retorno:**

- Caso tudo ocorra bem, será retornado o id da nova notícia, caso contrário, uma mensagem descrevendo o que houve de errado.

### PATCH

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
  [Aqui](https://github.com/HenriqueCruz5341/UFES/blob/18123a7950d42a8a4b1c895193d4ef46a2fa6026/web/sitePet/web/src/App.js#L51) está um exemplo de como deve ser mais ou menos.

**Retorno:**

- Caso tudo ocorra bem, será retornado uma mensagem de sucesso, caso contrário, uma mensagem descrevendo o que houve de errado.

### DELETE

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

### GET

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

### PATCH

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

### GET

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

```js
router.get("/downloadDocument/:idFile", fileController.downloadDocument);
```

**Descrição:**

- Retorna o arquivo de um documento do PET específico que está cadastrado no banco, para que o download do mesmo possa ser efetuado.

**URL:**

- `localhost:3333/api/file/downloadDocument/:idFile`

**Parametros esperados:**

- id do campo `file` do documento que deseja-se fazer o download deve ser passado pela propria URL, Ex: `localhost:3333/api/file/downloadDocument/53bsd2n`

```json
  "document": {
    "_id": "5ea46187ab1b8825fa6ad89b",
    "owner": "Molibe",
    "file": {
      "_id": "5ea46187ab1b8825fa6ad89a", este é o campo que deve ser passado
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

```js
router.get("/downloadInscription/:idFile", fileController.downloadInscription);
```

**Descrição:**

- Retorna o arquivo de uma inscrição específica que está cadastrado no banco, para que o download do mesmo possa ser efetuado.

**URL:**

- `localhost:3333/api/file/downloadInscription/:idFile`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do campo `file` da inscrição que deseja-se fazer o download deve ser passado pela propria URL, Ex: `localhost:3333/api/file/downloadInscription/53bsd2n`

```json
"inscriptions": [
    {
      "accepted": false,
      "_id": "5eaa0991415a907122286841",
      "name": "Henrique",
      "email": "henrique@email.com",
      "phone": "28999720210",
      "file": {
        "_id": "5eaa0990415a907122286840",  este é o campo que deve ser passado
        "name": "arquivos.zip",
        "size": 288250,
        "key": "bb982e16c8216dc451894935138d455b-arquivos.zip",
        "createdAt": "2020-04-29T23:11:12.882Z",
        "__v": 0
      },
      "__v": 0
    }
  ]
```

**Retorno:**

- O arquivo que foi solicitado.

```js
router.get("/getImageNews/:idFile", fileController.getImageNews);
```

**Descrição:**

- Retorna a imagem de uma noticia específica que está cadastrado no banco, para que a mesma possa ser mostrada no frontend. [Aqui](https://github.com/HenriqueCruz5341/UFES/blob/master/web/sitePet/web/src/News.js#L88) está um exemplo.

**URL:**

- `localhost:3333/api/file/getImageNews/:idFile`

**Parametros esperados:**

- id do campo `file` da noticia que deseja-se fazer o download deve ser passado pela propria URL, Ex: `localhost:3333/api/file/getImageNews/53bsd2n`

```json
{
  "new": {
    "_id": "5eb4123c5e447328516ee00c",
    "title": "asndankjs",
    "file": {
      "_id": "5eb4123c5e447328516ee00b", esse é o campo que deve ser passado
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

```js
router.get("/getProfilePhoto/:idFile", fileController.getProfilePhoto);
```

**Descrição:**

- Retorna a imagem de perfil de um membro.

**URL:**

- `localhost:3333/api/file/getProfilePhoto/:idFile`

**Parametros esperados:**

- id do campo `file` da noticia que deseja-se fazer o download deve ser passado pela propria URL.
**Retorno:**

- A imagem que foi solicitada.

### DELETE

```js
router.delete("/:idFile", verify, fileController.destroy);
```

**Descrição:**

- Deleta qualquer arquivo do banco de dados, (não deleta o arquivo do servidor).

**URL:**

- `localhost:3333/api/file/:idFile`

**Parametros esperados:**

- id do arquivo que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/file/53bsd2n`

**Retorno:**

- Caso tudo tenha dado certo, uma mensagem mostrando que deu certo, caso contrário, uma mensagem de erro dizendo o que houve de errado.

## Rotas de Contato

### POST

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

### GET

```js
router.get("/", memberController.index);
```

**Descrição:**

- Lista todas os membros cadastrados no banco.

**URL:**

- `localhost:3333/api/members/`

**Parametros esperados:**

- Token de validação que deve ser passado no header. (?)

**Retorno:**

- Lista de todos os membros cadastrados no banco.

```js
router.get("/:id", memberController.show);
```

**Descrição:**

- Lista um membro específico.

**URL:**

- `localhost:3333/api/members/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.(?)
- id do membro que deseja-se obter deve ser passado pela propria URL, Ex: `localhost:3333/api/members/53bsd2n`

**Retorno:**

- O membro que possui o id passado pela URL, caso o mesmo exista.

### POST

```js
router.post("/", verify, memberController.store);
```

**Descrição:**

- Cadastra um novo membro no banco.

**URL:**

- `localhost:3333/api/members/`

**Parametros esperados:**

- Body do tipo JSON com os campos `memberName`, `description`, `email`, `password`, `phone`, `startPet`, `active`.

**Retorno:**

- Caso tudo ocorra bem, será retornado o id do novo membro, caso contrário, uma mensagem descrevendo o que houve de errado.

### PUT

```js
router.put("/:memberId", verify, memberController.update);
```

**Descrição:**

- Edita os campos `memberName`, `description`, `email`, `password`, `phone`, `startPet`, `endPet`, `active`, `socialMidia`, `tags` de um membro que já esta no banco.

**URL:**

- `localhost:3333/api/members/:meberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se alterar deve ser passado pela própria URL. Ex: `localhost:3333/api/members/0as87dashd7`
- Body do tipo JSON com os campos `memberName`, `description`, `email`, `password`, `phone`, `startPet`, `endPet`, `active`, `socialMidia`. 

**Retorno:**

- Caso tudo ocorra bem,será retornado uma mensagem de sucesso, caso contrário, uma mensagem descrevendo o que houve de errado.

### PATCH

```js
router.patch("/sairDoPet/:memberId", verify, memberController.sairDoPet)
```

**Descrição:**

- Altera o campo `active` para falso, deleta os campos `description`, `backgroundPhoto`, e solicita nova data para `endPet` pelo body, de um membro que acabou de sair do PET.

**URL:**

- `localhost:3333/api/members/sairDoPet/:memberid`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/members/sairDoPet/53bsd2n`
- Body do tipo JSON com o campo `endPet`.

**Retorno:**

- Caso tudo ocorra bem, será retornado uma mensagem de sucesso, caso contrário, uma mensagem descrevendo o que houve de errado.


```js
router.patch(
  "/firstBackgroundPhoto/:memberId",
  verify,
  multer(multerConfig("members")).single("backgroundPhoto"),
  memberController.firstBackgroundPhoto
);
```

**Descrição:**

- Insere a primeira imagem de fundo de um membro que ja foi cadastrado.

**URL:**

- `localhost:3333/api/members/firstBackgroundPhoto/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se adicionar a imagem deve ser passado pela propria URL, Ex: `localhost:3333/api/members/firstBackgroundPhoto/53bsd2n`
- Body do tipo multipart-form com o campo `backgroundPhoto`.

**Retorno:**

- Caso tudo ocorra bem, será retornado as informações sobre o membro que foi alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

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


```js
router.patch(
  "/updateBackgroundPhoto/:memberId",
  verify,
  multer(multerConfig("members")).single("backgroundPhoto"),
  memberController.updateBackgroundPhoto
);
```

**Descrição:**

- Altera a imagem de fundo de um membro que ja foi cadastrado.

**URL:**

- `localhost:3333/api/members/updateBackgroundPhoto/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se alterar deve ser passado pela propria URL, Ex: `localhost:3333/api/members/updateBackgroundPhoto/53bsd2n`
- Body do tipo multipart-form com o campo `backgroundPhoto`.

**Retorno:**

- Caso tudo ocorra bem, será retornado as informações sobre o membro que foi alterado, caso contrário, uma mensagem descrevendo o que houve de errado.

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


### DELETE

```js
router.delete("/:memberId", verify, memberController.delete);
```

**Descrição:**

- Deleta um membro específico do banco.

**URL:**

- `localhost:3333/api/members/:memberId`

**Parametros esperados:**

- Token de validação que deve ser passado no header.
- id do membro que deseja-se deletar deve ser passado pela propria URL, Ex: `localhost:3333/api/members/53bsd2n`

**Retorno:**

- Caso tudo ocorra bem, será mostrado as informações do membro deletado, caso contrário, uma mensagem descrevendo o que houve de errado.


## Considerações

### Middleware verify

As rotas que possuem um `verify`, por exemplo, `router.get("/", verify, inscriptionsController.index)`,
o token deve ser passado pelo header [dessa forma](https://www.schoolofnet.com/forum/topico/configurando-a-autenticacao-com-o-axios-1616).

### Envio de arquivos

- Os arquivos de documentos do PET devem estar no formato de PDF.
- Os arquivos de documentos das inscrições devem estar compactados em formato ZIP.

### Download dos arquivos

Um exemplo de como se fazer o download dos arquivos retornados pela api pode ser encontrado [aqui](https://github.com/HenriqueCruz5341/UFES/blob/master/web/sitePet/web/src/App.js#L24)

### Tipo de imagens suportadas no Backend

- jpeg
- jpg
- png
- gif
- svg

### Exibir imagens que vem do backend no frontend

Um exemplo de como pode ser feita a exibição de imagens que virão do backend pode ser encontrado [aqui](https://github.com/HenriqueCruz5341/UFES/blob/master/web/sitePet/web/src/News.js#L88)

### Deletar inscrições

**NÃO** deletar inscrições que estejam dentro de um processo seletivo pela rota `api/inscriptions/:id`, para fazer isso utilize a rota
`api/selection/removeInscription/:id`, a primera rota funcionará perfeitamente para o caso de algum erro e a inscrição não esteja
vinculada a nenhum processo selevito.
