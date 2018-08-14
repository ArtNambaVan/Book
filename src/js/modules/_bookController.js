var booksFormController = (function() {

    var bookForm = document.getElementById('book-form');
    var table = document.querySelector( '.books' );

    var createForm = function() {
        var $tmpl     = $('#temp').html(),
            $bookForm = $('#book-form'),
            html
        ;

        html = Mustache.to_html($tmpl);
        $bookForm.html(html).hide().fadeIn(1000);

    };

    var removeForm = function() {
        $('#book-form').children().fadeOut(500,function(){
            $(this).remove();
        });
    };



    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createBook();
    });


    var createBook = function() {
        var inputTitle           = bookForm.querySelector('.js-title'),
            inputDescription     = bookForm.querySelector('.js-description'),
            inputPanel           = bookForm.querySelector('.panel'),
            inputType            = bookForm.querySelectorAll('input[type="radio"]'),
            inputCheckbox        = bookForm.querySelectorAll('.genre-checkbox'),
            genreArr = [],
            genre, type, now, date, author
            ;

        author = usersData.getCurrentUser()[0].name;

        inputType.forEach(function(el) {
            if (el.checked) {
                type = el.value;
                return type;
            }
        });

        inputCheckbox.forEach(function(el) {
            if (el.checked) {
                genreArr.push(el.value);
            }

            return genreArr;
        });

        genre = genreArr.join(', ');

        if (inputTitle.value !== '' && inputDescription.value !== '' && genre !== '') {

            now = new Date();
            date = now.getHours() + ':' + (now.getMinutes().toString().length === 2 ? now.getMinutes() : '0' + now.getMinutes());

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

            addBookToTable(newItem)
            inputTitle.classList.remove('border-success');
            inputDescription.classList.remove('border-success')
            hideAlert();
            $('.panel').off();
        } else {
            showAlert();
            validateForm(inputTitle, inputDescription)

        }
    };

    var formError = function(inputName) {
        if (inputName.value === '') {
            inputName.classList.add('border-danger');
            inputName.focus();
        }
        inputName.addEventListener('input', function() {
            if (inputName.value === '') {
            inputName.classList.remove('border-success');
            inputName.classList.add('border-danger');
          } else if (inputName.value !== '') {
            inputName.classList.remove('border-danger');
            inputName.classList.add('border-success');
          }
        });
    }

    var showAlert = function() {

        $('#requireAlert').show('fade');

    };

    var hideAlert = function() {
        $('#requireAlert').hide();
    };

    var validateForm = function(title, description) {
        checked = $(".genre-checkbox:checked").length

        if (checked === 0) {
            $('.invalid-feedback').addClass('d-block')
        }
        $('.panel').on('change', function(){
            checked = $(".genre-checkbox:checked").length
            if (checked > 0) {
                $('.invalid-feedback').removeClass('d-block')
            } else {
                $('.invalid-feedback').addClass('d-block')
            }
        });
        formError(description);
        formError(title);

    }


    mediator.subscribe('userLogOut', hideAlert);


    var addBookToTable = function(obj) {
        var bookList = document.querySelector('.table-group'),
            tmpl = document.getElementById('comment-template').content.cloneNode(true);
        tmpl.querySelector('.id').innerText = obj.id;
        tmpl.querySelector('.title').innerText = obj.title;
        tmpl.querySelector('.description').innerText = obj.description;
        tmpl.querySelector('.author').innerText = obj.author;
        tmpl.querySelector('.date').innerText = obj.date;
        tmpl.querySelector('.genre').innerText = obj.genre;
        tmpl.querySelector('.type').innerText = obj.type;
        tmpl.querySelector('.js-delete-btn').addEventListener('click', deleteBookFromTable);
        bookList.appendChild(tmpl);

        updateBookPosition();
        mediator.publish('increaseCounter');
    };

    var updateBookPosition = function() {
        var $booksRow = $('.books-table').find('.table-book:not(:first-child)');
        $booksRow.each(function (index) {
            if ($(this).attr('data-position') != (index + 1)) {
                $(this).attr('data-position', (index + 1)).addClass('updated');
                $(this).find('.position').text(index + 1);
            }
        });
        booksData.localStorageNewPosition($booksRow);
    };

    var deleteBookFromTable = function(e) {
        if (e.target.classList.contains('js-delete-btn')) {
            e.target.parentElement.parentElement.remove();
            booksData.removeBookItem(e.target.parentElement.parentElement.querySelector('.id').textContent);
            updateBookPosition();
            mediator.publish('reduceCount');
        }
    };

    var showAllBooks = function() {
        removeAllBooks();
        var allBooks = booksData.getBookItems();

        function comparePos(posA, posB) {

            return posA.position - posB.position;
        }

        allBooks.sort(comparePos);

        allBooks.forEach(function(e) {
            addBookToTable(e);
        });

        updateBookPosition();

        mediator.publish('countAllBooks', allBooks);
    };

    var showPublicBooks = function(type) {
        removeAllBooks();

        var publicBooks = [],
            allBooks = booksData.getBookItems();

        function comparePos(posA, posB) {
            return posA.position - posB.position;
        }

        allBooks.sort(comparePos);

        allBooks.forEach(function(e) {
            if (e.type.toLowerCase() === 'public') {
                addBookToTable(e);
                publicBooks.push(e);
            }
        });
        removeDeleteBtns();
        updateBookPosition();
        mediator.publish('countPublicBooks', publicBooks);
    };

    var removeAllBooks = function() {
        var booksRow = document.querySelectorAll('.table-book');
        booksRow.forEach(function(e) {
            e.remove();
        });
        updateBookPosition();
    };

    var sortable = function() {
        $('.books-table').attr('id', 'sortable');
        var arr = [];
        $('#sortable').sortable({
            update: function (event, ui) {
                updateBookPosition();

                saveNewPosition();
            },
            disabled: false,

            change: function(event, ui) {
                ui.placeholder.css({
                    visibility: 'visible',
                    background: 'rgba(0,123,255,.25)',
                    height: '60px'
                });
            }
        });
    };

    var removeSortable = function() {
        $('#sortable').sortable({
            disabled: true
        });
    };

    var saveNewPosition = function() {
        var positions = [];
        $('.updated').each(function () {
            positions.push([$(this).rowIndex, $(this).attr('data-position')]);
            $(this).removeClass('updated');
        });
    };

    var removeDeleteBtns = function() {

        $('.js-delete-btn').remove();
    };

    mediator.subscribe('userOutSession', showPublicBooks);
    mediator.subscribe('userSession', sortable);
    mediator.subscribe('userSession', showAllBooks);

    mediator.subscribe('userLogIn', [showAllBooks, sortable, createForm]);

    mediator.subscribe('userLogOut', showPublicBooks);

   // mediator.subscribe('userLogIn', sortable);

    mediator.subscribe('userLogOut', removeSortable);


   // mediator.subscribe('userLogIn', createForm);
    mediator.subscribe('userSession', createForm);
    mediator.subscribe('userLogOut', removeForm);

})();
