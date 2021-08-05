function update(list) {

    $('#question').text(list[0]);
    i = 0;
    $('.option').on('click', () => {
        if (i < list.length) {
            i += 1;
            $('#question').text(list[i]);
    
        if (i >= list.length - 1) {
            $('#next').removeClass('d-none');
        }
    });

    
}
