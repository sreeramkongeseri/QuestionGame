const express = require("express");
const cors = require("cors");
const data = require('./data.js');

console.log(data.quesData, data.appData)

const app = express();
app.use(cors({origin: true}));
const port = 3000;

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/api/level1", (req, res) => {
  res.send(getQuestions());
});

app.get("/api/level2", (req, res) => {
  res.send(getVerbs());
});

app.get("/api/level3", (req, res) => {
  res.send("hello");
});

app.get("/api/level4", (req, res) => {
  res.send("hello");
});
