const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({origin: true}));
const port = 3000;

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/api/level1", (req, res) => {
  res.send("hello");
});

app.get("/api/level2", (req, res) => {
  res.send("hello");
});

app.get("/api/level3", (req, res) => {
  res.send(quesData);
});

app.get("/api/level4", (req, res) => {
  res.send(quesData);
});

exports.app = functions.https.onRequest(app);