$(document).ready(function() {

    list = ['question 1', 'question 2', 'question 3', 'question 4'];
    
    update(list);
});


function update(list) {

    $('#question').text(list[0]);
    i = 0;
    $('.square').on('click', () => {
        $('#question').text(list[++i]);
    });
}
