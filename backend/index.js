const express = require("express");
// Express 4 nao captura erro de funcao async: a promise rejeitada virava
// unhandledRejection e o Node encerrava o processo. Um GET /api/login/ sem
// cabecalho bastava para derrubar a API. Com isto, o erro chega ao handler
// abaixo e vira 500.
require("express-async-errors");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();

const newsRoute = require("./routes/news");
const documentsRoute = require("./routes/documents");
const fileRoute = require("./routes/file");
const contactRoute = require("./routes/contact");
const loginRoute = require("./routes/login");
const comissionsRoute = require("./routes/comissions");
const membersRoute = require("./routes/members");
const projectsRoute = require("./routes/projects");
const selectionRoute = require("./routes/selection");

// Sem banco a API nao serve nada. Em 26/10/2026 o processo, no ar desde 13/10,
// perdeu a conexao com o Atlas e nunca voltou: o mongoose segura cada consulta ate
// reconectar, sem prazo, e o site ficou com as paginas carregando para sempre
// enquanto o container aparecia "healthy". Agora a falha na conexao inicial encerra
// o processo, e o vigia abaixo encerra depois de 3 minutos sem resposta do banco;
// o Docker (restart: always) sobe outro, que conecta de novo.
mongoose
  .connect(process.env.DB_CONNECT, {
    serverSelectionTimeoutMS: 15000,
  })
  .then(() => console.log("Connected to db!"))
  .catch((err) => {
    console.error("Sem conexao com o banco:", err.message);
    process.exit(1);
  });

function pingaBanco() {
  if (mongoose.connection.readyState !== 1) {
    return Promise.reject(new Error("desconectado"));
  }
  return Promise.race([
    mongoose.connection.db.admin().ping(),
    new Promise((_, rejeita) =>
      setTimeout(() => rejeita(new Error("ping sem resposta em 10 s")), 10000)
    ),
  ]);
}

let falhasSeguidas = 0;
setInterval(async () => {
  try {
    await pingaBanco();
    falhasSeguidas = 0;
  } catch (err) {
    falhasSeguidas += 1;
    console.error(`Banco sem resposta (${falhasSeguidas}/3):`, err.message);
    if (falhasSeguidas >= 3) process.exit(1);
  }
}, 60000).unref();

// Atrás do Traefik: req.ip é o IP de quem acessou, não o do proxy.
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) =>
  pingaBanco()
    .then(() => res.status(200).send("ok"))
    .catch(() => res.status(503).send("sem banco"))
);

app.use("/api/news", newsRoute);
app.use("/api/documents", documentsRoute);
app.use("/api/file", fileRoute);
app.use("/api/contact", contactRoute);
app.use("/api/login", loginRoute);
app.use("/api/comissions", comissionsRoute);
app.use("/api/members", membersRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/selection", selectionRoute);

// Ultimo middleware: erro de qualquer rota responde 500 sem detalhe e fica no log.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Erro de cliente (JSON malformado 400, corpo grande demais 413) mantem o
  // status que o middleware deu; o resto e erro nosso: 500 sem detalhe, no log.
  const status = err.status || err.statusCode;
  if (status >= 400 && status < 500) {
    return res.status(status).json({ message: "Bad request." });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(process.env.PORT || 3333, () => console.log("Server running"));
