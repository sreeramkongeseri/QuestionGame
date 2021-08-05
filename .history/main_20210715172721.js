$(document).ready(function() {

    continueBtn();
    list = ['question 1', 'question 2', 'question 3', 'question 4'];
    $('#l1 .question').text(list[0]);
    i = 0;
    $('#l1 .square').on('click', () => {
        $('#l1 .question').text(list[++i]);
    })

});


function continueBtn() {

    $('#btn0').click(() => {
        $('#intro').toggleClass('d-none');
        $('#l1').toggleClass('d-none');
    });

    $('#btn1').click(() => {
        $('#l1').toggleClass('d-none');
        $('#l2').toggleClass('d-none');
    })

    $('#btn2').click(() => {
        $('#l2').toggleClass('d-none');
        $('#l3').toggleClass('d-none');
    })

    $('#btn3').click(() => {
        $('#l3').toggleClass('d-none');
        $('#l4').toggleClass('d-none');
    })

    $('#btn4').click(() => {
        $('#l4').toggleClass('d-none');
        $('#score').toggleClass('d-none');
    })

}