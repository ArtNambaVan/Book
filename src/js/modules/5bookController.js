var booksFormController = (function(){

    var bookForm        = document.getElementById('book-form'),
        title           = bookForm.querySelector('.js-title'),
        description     = bookForm.querySelector('.js-description'),
        author          = bookForm.querySelector('.js-author'),
        genre           = bookForm.querySelector('.js-genre'),
        type            = bookForm.querySelectorAll('input[type="radio"]'),
        typeNew
        ;

    var showForm = function(boolean) {
        if (boolean) {
            bookForm.classList.remove( 'd-none' );
        } else {
            bookForm.classList.add( 'd-none' );
        }

    };

    mediator.subscribe('userLogin', showForm);

    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createBook();
    });

    var createBook = function() {

        type.forEach(function( el ) {
            if ( el.checked ) {
                typeNew = el.value;
                return typeNew;
            }
        });

        if (title.value !== '' && description.value !== '' && genre !== '') {

            var date = new Date();
            var h = date.getHours();
            var m = date.getMinutes();
            date = h + ':' + m;

            var bookItem = {
                title: title.value,
                description: description.value,
                author: author.value,
                genre: genre.value,
                type: typeNew,
                date: date
            };
        }

        var newItem = booksData.addBookItem(bookItem);

        mediator.publish( 'newBook', newItem );
    };

})();
