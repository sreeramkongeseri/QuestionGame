$(document).ready(function() { 
    ques = $('#question');
    score_elem = $('#score');
    num_elem = $('#num');
});

function update(quesData) {
    
    var score = 0;

    ques.text(quesData[0]['Question']);
    i = 0;
    $('.option').on('click', () => {

        if (i < quesData.length - 1) {

            i += 1;

            ques.text(quesData[i]['Question']);
            
            if ($(this).attr('id') == 'lots') {
                console.log($(this).attr('id'));
                if (quesData[i]['BT Level'] in [1, 2, 3]) {
                    score++;
                }
            } else if (quesData[i]['BT Level'] in [4, 5, 6]) {
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
