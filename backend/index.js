const express = require("express");
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
  () => console.log("Conneted to db!")
);

app.use(express.json());
app.use(cors());

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

app.listen(process.env.PORT || 3333, () => console.log("Server running"));
