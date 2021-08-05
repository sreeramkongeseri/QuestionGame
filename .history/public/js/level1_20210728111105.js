var ques = $('#question');
var score_elem = $('#score');
var num_elem = $('#num');

var num_quests = 5;

$(document).ready(function() {
    
    $('#theoryText').html(getTheory());
    
    const db = getDB().ref();
    db.child('questions').get().then(snapshot => {
        if (snapshot.exists()) {
          update(snapshot.val())
        } else {
          console.log('No data available')
        }
      }).catch(error => {
        console.error(error)
      });
});

function update(quesData) {
  
  var score = 0;

  ques.text(quesData[0]['Question'])
  score_elem.text('0')
  num_elem.text('1')

  let i = 0
  $('.option').on('click', function () {
    if (i < quesData.length - 1) {
      if ($(this).attr('id') == 'lots') {
        if (['1', '2', '3'].includes(quesData[i]['BT Level'])) {
          score++
        }
      } else if (['4', '5', '6'].includes(quesData[i]['BT Level'])) {
        score++
      }

      i += 1

      ques.text(quesData[i]['Question'])
      score_elem.text(score)
      num_elem.text(i)
    } else {
      $('#question').text('done!')
      $('#next').removeClass('d-none')
      $('.option').addClass('d-none')
    }
  })
}
