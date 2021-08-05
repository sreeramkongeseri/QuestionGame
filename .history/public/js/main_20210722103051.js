$(document).ready(function() { 
    ques = $('#question');
    score_elem = $('#score');
    num_elem = $('#num');
});

function update(quesData) {
    
    var score = 0;

    ques.text(quesData[0]['Question']);
    i = 0;
    $('.option').on('click', function () {

        if (i < quesData.length - 1) {

            i += 1;

            ques.text(quesData[i]['Question']);
            console.log(quesData[i]);
            
            if ($(this).attr('id') == 'lots') {
                console.log("we're right!");
                if (['1', '2', '3'].includes(quesData[i]['BT Level'])) {
                    score++;
                }
            } else if (['4', '5', '6'].includes(quesData[i]['BT Level'])) {
                console.log("oh we're here");
                score++;
            }

            score_elem.text(score);
            num_elem.text(i);

        } else {

            $('#question').text("done!");
            $('#next').removeClass('d-none');
            $('.option').addClass('d-none');
        }
    });

    
}
