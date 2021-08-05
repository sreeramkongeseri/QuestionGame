const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
const port = 3000;


app.use("/", express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


const questions1 = ["question 1.1", "question 1.2", "question 1.3", "ques 1.4"];
const questions2 = ["question 2.1", "question 2.2", "question 2.3", "ques 2.4"];
const questions3 = ["question 3.1", "question 3.2", "question 3.3", "ques 3.4"];
const questions4 = ["question 4.1", "question 4.2", "question 4.3", "ques 4.4"];

app.get("/api/level1", (req, res) => {
  res.send(questions1);
});

app.get("/api/level2", (req, res) => {
  res.send(questions2);
});

app.get("/api/level3", (req, res) => {
  res.send(questions3);
});

app.get("/api/level4", (req, res) => {
  res.send(questions4);
});

exports.app = functions.https.onRequest(app);
