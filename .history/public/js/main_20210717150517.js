function update(list) {

    $('#question').text(list[0]);
    i = 0;
    $('.square').on('click', () => {
        $('#question').text(list[++i]);
    });
}
