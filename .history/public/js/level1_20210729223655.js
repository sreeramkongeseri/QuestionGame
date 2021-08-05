var ques;
var score_elem;
var ques_no;

var totalQues = 5;
var score = 0;

$(document).ready(function() {

    ques = $('#question');
    score_elem = $('#score');
    ques_no = $('#num');
    
    $('#theoryText').html(getTheory());
    
    const db = getDB().ref();
    db.child('questions').get().then(snapshot => {
        if (snapshot.exists()) {
          update(snapshot.val());
        } else {
          console.log('No data available');
        }
      }).catch(error => {
        console.error(error);
      });
});

function update(quesData) {

  // num_ques = quesData.length;

  ques.text(quesData[0]['Question']);
  score_elem.text('0/' + totalQues);
  ques_no.text('1');

  let i = 0;
  $('.option').on('click', function () {

    if (i < totalQues - 1) {
      if ($(this).attr('id') == 'lots') {
        if (['1', '2', '3'].includes(quesData[i]['BT Level'])) {
          score++;
        }
      } else if (['4', '5', '6'].includes(quesData[i]['BT Level'])) {
        score++;
      }

      i += 1;

      ques.text(quesData[i]['Question']);
      score_elem.text(score + "/" + totalQues);
      ques_no.text('' + (i + 1));
    } else {
      
    }
  });
}
