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
const inscriptionsRoute = require("./routes/inscriptions");
const documentsRoute = require("./routes/documents");
const fileRoute = require("./routes/file");
const contactRoute = require("./routes/contact");
const loginRoute = require("./routes/login");
const comissionsRoute = require("./routes/comissions");
const membersRoute = require("./routes/members");
const projectsRoute = require("./routes/projects");
const selectionRoute = require("./routes/selection");

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to db!")
);

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => res.status(200).send("ok"));

app.use("/api/news", newsRoute);
app.use("/api/inscriptions", inscriptionsRoute);
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
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(process.env.PORT || 3333, () => console.log("Server running"));
