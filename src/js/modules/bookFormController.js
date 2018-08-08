var booksFormController = (function() {

    var bookForm = document.getElementById('book-form');

    var createForm = function() {
        var $tmpl     = $('#temp').html(),
            $bookForm = $('#book-form'),
            html
        ;

        html = Mustache.to_html($tmpl);
        $bookForm.html(html).hide().fadeIn(1000);

        addListenerOnGenre();
    };

    var addListenerOnGenre = function() {
        var $arrow = $('#book-form').find('.toggle-arrow'),
            $panel = $('#book-form').find('.panel')
        ;
        $panel.hide();

        $arrow.on('click', function() {
            $panel.toggle('slow');
        });
    };

    var removeForm = function() {
        $('#book-form').children().fadeOut(500,function(){
            $(this).remove();
        });
    };

    mediator.subscribe('userLogIn', createForm);
    mediator.subscribe('userLogOut', removeForm);

    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createBook();
    });

    var createBook = function() {
        var inputTitle           = bookForm.querySelector('.js-title'),
            inputDescription     = bookForm.querySelector('.js-description'),
            inputType            = bookForm.querySelectorAll('input[type="radio"]'),
            inputCheckbox        = bookForm.querySelectorAll('.genre-checkbox'),
            genre                = '',
            type, now, date, user, author
            ;

        user = usersData.getCurrentUser()[0];
        author = user.name;

        inputType.forEach(function(el) {
            if (el.checked) {
                type = el.value;
                return type;
            }
        });

        inputCheckbox.forEach(function(el) {
            if (el.checked) {
                genre += el.value + ' ';
            }
            return genre;
        });

        if (inputTitle.value !== '' && inputDescription.value !== '' && genre !== '') {

            now = new Date();
            date = now.getHours() + ':' + now.getMinutes();

            var bookItem = {
                title: inputTitle.value,
                description: inputDescription.value,
                author: author,
                genre: genre,
                type: type,
                date: date
            };
            bookForm.reset();


            var newItem = booksData.addBookItem(bookItem);

            mediator.publish('newBook', newItem);
            mediator.publish('hideMandatory');
        } else {
            mediator.publish('mandatory');
        }
    };
})();
