var booksFormController = (function(){

    var bookForm             = document.getElementById('book-form'),
        inputTitle           = bookForm.querySelector('.js-title'),
        inputDescription     = bookForm.querySelector('.js-description'),
        inputAuthor          = bookForm.querySelector('.js-author'),
        inputGenre           = bookForm.querySelector('.js-genre'),
        inputType            = bookForm.querySelectorAll('input[type="radio"]'),
        type
        ;

    var showForm = function() {
        bookForm.classList.remove( 'd-none' );
    };

    var hideForm = function() {
        bookForm.classList.add( 'd-none' );
    };

    mediator.subscribe('userLogIn', showForm);
    mediator.subscribe('userLogOut', hideForm);

    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createBook();
    });

    var createBook = function() {
        var now, date;

        inputType.forEach(function( el ) {
            if ( el.checked ) {
                type = el.value;
                return type;
            }
        });

        if (inputTitle.value !== '' && inputDescription.value !== '' && inputGenre !== '') {

            now = new Date();
            date = now.getHours() + ':' + now.getMinutes();

            var bookItem = {
                title: inputTitle.value,
                description: inputDescription.value,
                author: inputAuthor.value,
                genre: inputGenre.value,
                type: type,
                date: date
            };
            bookForm.reset();
        }

        var newItem = booksData.addBookItem(bookItem);

        mediator.publish( 'newBook', newItem );
    };


})();
