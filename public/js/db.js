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