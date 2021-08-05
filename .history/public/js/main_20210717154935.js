function update(list) {

    $('#question').text(list[0]);
    i = 0;
    $('.option').on('click', () => {
        if (i < list.length - 1) {
            i += 1;
            $('#question').text(list[i]);
        } else {
            $('#question').text("done!")
            $('#next').removeClass('d-none');
    });

    
}
