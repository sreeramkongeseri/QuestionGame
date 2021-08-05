function update(quesData) {

    $('#question').text(quesData[0]['Question']);
    i = 0;
    $('.option').on('click', () => {
        if (i < quesData.length - 1) {
            i += 1;
            
            $('#question').text(quesData[i]);
            
            if ($(this).attr('id') == 'lots') {
                if (quesData[i]['BT Level'] in [1, 2, 3]) {
                    score++;
                }
            } else if (quesData[i]['BT Level'] in [4, 5, 6]) {
                score++;
            }
    //    update(quesData)
    // );


        } else {
            $('#question').text("done!");
            $('#next').removeClass('d-none');
            $('.option').addClass('d-none');
        }
    });

    
}
