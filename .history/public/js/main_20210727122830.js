$(document).ready(function() { 
    
    ques = $('#question');
    score_elem = $('#score');
    num_elem = $('#num');

    $('#theoryText').html(getTheory());
    $('#playerName').text(window.localStorage.getItem('name'));
    
    start = Date.now();

    id = setInterval( () => {
        var elapsed = Date.now() - start;
        $('#time').text(time(elapsed));
    }, 1000);

    function time(ms) {
        return new Date(ms).toISOString().slice(14, -5);
    }

});

function update(quesData) {
    
    var score = 0;

    ques.text(quesData[0]['Question']);
    score_elem.text('0');
    num_elem.text('1');


    i = 0;
    $('.option').on('click', function () {

        if (i < quesData.length - 1) {
            
            if ($(this).attr('id') == 'lots') {

                if (['1', '2', '3'].includes(quesData[i]['BT Level'])) {
                    score++;
                }
            } else if (['4', '5', '6'].includes(quesData[i]['BT Level'])) {
                score++;
            }


            i += 1;

            ques.text(quesData[i]['Question']);
            score_elem.text(score);
            num_elem.text(i);

        } else {

            $('#question').text("done!");
            $('#next').removeClass('d-none');
            $('.option').addClass('d-none');
        }
    });

    
}


