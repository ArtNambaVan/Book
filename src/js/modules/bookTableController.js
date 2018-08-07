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

        var bookList = document.querySelector('.table-group');
        Array.from(bookList.children).forEach(function(e, i) {
            var position = e.querySelector('.position');

            if (position != null) {
                var num = i;
                position.textContent = num;
            }
        });
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

    var showPublicBooks = function() {
        var publicBooks = [],
            allBooks = booksData.getBookItems();

        allBooks.forEach(function(e) {
            if (e.type.toLowerCase() === 'public') {
                addBookToTable(e);
                publicBooks.push(e);
            }
        });

        updateBookPosition();
        mediator.publish('countPublicBooks', publicBooks);
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
    mediator.subscribe('userLogOut', hideBtn);

    /////////
    ////////////// DEBUG ///////////////////


    showPublicBooks();
    mediator.subscribe('userLogIn', showPrivateBooks);
    mediator.subscribe('userLogOut', removePrivateBooks);
    mediator.subscribe('newBook', addBookToTable);


    /////////
    ////////////// DEBUG ///////////////////
    hideBtn();
    /////////
    ////////////// DEBUG ///////////////////

})();
