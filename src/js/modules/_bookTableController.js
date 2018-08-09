var bookTableController = (function() {

    var table = document.querySelector( '.books' );

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
        var $bookRow = $('.books-table').find('.table-book:not(:first-child)');
        $bookRow.each(function (index) {
            if ($(this).attr('data-position') != (index + 1)) {
                $(this).attr('data-position', (index + 1)).addClass('updated');
                $(this).find('.position').text(index + 1);
            }
        });
        booksData.localStorageNewPosition($bookRow);

    };

    var deleteBookFromTable = function(e) {
        if (e.target.classList.contains('js-delete-btn')) {
            e.target.parentElement.parentElement.remove();
            booksData.removeBookItem(e.target.parentElement.parentElement.querySelector('.id').textContent);
            updateBookPosition();
            mediator.publish('reduceCount');
        }
    };

    var showPrivateBooks = function() {
        var privateBooks = [],
            allBooks = booksData.getBookItems();

        allBooks.forEach(function(e) {
            if (e.type.toLowerCase() === 'private') {
                addBookToTable(e);
                privateBooks.push(e);
            }
        });
        updateBookPosition();
        mediator.publish('countAllBooks', allBooks);
    };

/*    var showAllBooks = function() {
        var allBooks = booksData.getBookItems();

        allBooks.forEach(function(e) {
            addBookToTable(e);
        });

        mediator.publish('countAllBooks', allBooks);
    };*/

    var showPublicBooks = function() {
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

        updateBookPosition();
        mediator.publish('countPublicBooks', publicBooks);
    };

    var removeAllBooks = function() {
        var booksRow = document.querySelectorAll('.table-book');
        booksRow.forEach(function( e ) {
            e.remove();
        });
        updateBookPosition();
    };

    var removePrivateBooks = function() {
        var booksRow = document.querySelectorAll('.table-book');
        var books = [];

        booksRow.forEach(function( e ) {
            if (e.querySelector('.type').textContent.toLowerCase() === 'private') {
                books.push(e);
                e.remove();
            }
        });

        updateBookPosition();

        mediator.publish('removeCounter', books);
    };


    var sortable = function() {
        $('.books-table').attr('id', 'sortable');
        var arr = [];
        $('#sortable').sortable({
            update: function (event, ui) {
                updateBookPosition();

                saveNewPosition();
            },
            disabled: false

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
            console.log($(this));
            positions.push([$(this).rowIndex, $(this).attr('data-position')]);
            $(this).removeClass('updated');
        });
    };

    /////////
    ////////////// DEBUG ///////////////////

    var showBtn = function() {
        var btn = $('.js-delete-btn');
        btn.css('display', 'block');
    };

    var hideBtn = function() {
        var btn = $('.js-delete-btn');
        btn.css('display', 'none');
    };

    mediator.subscribe('userLogIn', showBtn);
    mediator.subscribe('userSession', showBtn);
    mediator.subscribe('userLogOut', hideBtn);

    /////////
    ////////////// DEBUG ///////////////////


    showPublicBooks();
    mediator.subscribe('userLogIn', showPrivateBooks);
    mediator.subscribe('userSession', showPrivateBooks);
/*    mediator.subscribe('userLogIn', showAllBooks);
    mediator.subscribe('userSession', showAllBooks);*/
    //mediator.subscribe('userLogOut', removePrivateBooks);
    //mediator.subscribe('userLogOut', removeAllBooks);
    mediator.subscribe('newBook', addBookToTable);
    mediator.subscribe('userLogIn', sortable);
    mediator.subscribe('userSession', sortable);
    mediator.subscribe('userLogOut', removeSortable);


    /////////
    ////////////// DEBUG ///////////////////
    hideBtn();
    /////////
    ////////////// DEBUG ///////////////////



/*    var createBtn = function() {
        var deleteTD = document.querySelectorAll('.delete'),
            tmpl = document.getElementById('comment-template').content.cloneNode(true);
        var delBtn = tmpl.querySelector('.delete');
        var btn = tmpl.querySelector('.js-delete-btn');
        btn.addEventListener('click', deleteBookFromTable);
        deleteTD.forEach(function(e) {
            console.log(e);
            e.appendChild(btn);
        });
    };



    var removeBtn = function() {
        $('.books-table').find('.js-delete-btn').each(function() {
            $(this).remove();
        });

    };

    mediator.subscribe('userLogOut', removeBtn);
    mediator.subscribe('userLogIn', createBtn);*/


})();
