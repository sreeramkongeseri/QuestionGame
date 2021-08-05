var id;
var elapsed = 0, start;

$(document).ready(function () {

  $('#theoryText').html(getTheory());
  $('#playerName').text(window.localStorage.getItem('name'));

  start = Date.now();
  $('#time').text("00:00");

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

