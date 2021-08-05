function update(list) {

    $('#question').text(list[0]);
    i = 0;
    $('.option').on('click', () => {
        $('#question').text(list[++i]);
    });

    if (i == list.length - 1) {
        $('#next').toggleClass('d-none');
    }
}
