const express = require("express");
const cors = require("cors");
const data = require('./data');

const port = 3000;


const app = express();
app.use(cors({origin: true}));

app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/api/level1", (req, res) => {
  res.send(getQuestions());
});

app.get("/api/level2", (req, res) => {
  res.send(quesData);
});

app.get("/api/level3", (req, res) => {
  res.send("hello");
});

app.get("/api/level4", (req, res) => {
  res.send("hello");
});
