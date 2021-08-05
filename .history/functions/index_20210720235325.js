const functions = require("firebase-functions");
const express = require('express');

const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

questions1 = ['question 1.1', 'question 1.2', 'question 1.3', 'question 1.4'];
questions2 = ['question 2.1', 'question 2.2', 'question 2.3', 'question 2.4'];
questions3 = ['question 3.1', 'question 3.2', 'question 3.3', 'question 3.4'];
questions4 = ['question 4.1', 'question 4.2', 'question 4.3', 'question 4.4'];



app.get('/api/level1', (req, res) => {
    res.send(questions1);
});

app.get('/api/level2', (req, res) => {
    res.send(questions2);
});

app.get('/api/level3', (req, res) => {
    res.send(questions3);
});

app.get('/api/level4', (req, res) => {
    res.send(questions4);
});

exports.helloWorld = functions.https.onRequest(app);