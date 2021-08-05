const firebaseConfig = {
  apiKey: 'AIzaSyDZP97SgzIAm4Nby74RjnM5tY4KNVVa-9A',
  authDomain: 'secret-game-5262b.firebaseapp.com',
  databaseURL: 'https://secret-game-5262b-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'secret-game-5262b',
  storageBucket: 'secret-game-5262b.appspot.com',
  messagingSenderId: '1086751075651',
  appId: '1:1086751075651:web:0148ebefa09762361c93f6',
  measurementId: 'G-BJVWN71MSZ'
};

firebase.initializeApp(firebaseConfig)

// Get a reference to the database service
const database = firebase.database();

function getDB() {
  return database;
}

var id;
var elapsed = 0, start;

$(document).ready(function () {

  $('#theoryText').html(getTheory());
  $('#playerName').text(window.localStorage.getItem('name'));

  start = Date.now();

  id = setInterval(() => {
      elapsed = Date.now() - start
    $('#time').text(time(elapsed))
  }, 1000);
  
  $("#howModal").modal('show');
});

function pauseTime() {
  clearInterval(id);
}

function playTime() {
  start = Date.now() - elapsed;
  id = setInterval(() => {
    elapsed = Date.now() - start
  $('#time').text(time(elapsed))
}, 1000);
}


function time (ms) {
  let time = new Date(ms).toISOString().slice(14, -5);
  console.log(time);
  return time;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

