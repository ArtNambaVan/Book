var bookTableController = (function() {

    var table = document.querySelector('.books');

    var addBookToTable = function(obj) {
        var bookList = document.querySelector('.table-group');
        var tmpl = document.getElementById('comment-template').content.cloneNode(true);
        tmpl.querySelector('.id').innerText = obj.id;
        tmpl.querySelector('.title').innerText = obj.title;
        tmpl.querySelector('.description').innerText = obj.description;
        tmpl.querySelector('.author').innerText = obj.author;
        tmpl.querySelector('.date').innerText = obj.date;
        tmpl.querySelector('.genre').innerText = obj.genre;
        tmpl.querySelector('.type').innerText = obj.type;
        tmpl.querySelector('.js-delete-btn').addEventListener('click', deleteBookFromTable);
        bookList.appendChild(tmpl);

        //mediator.publish('updateCounter', 'plus');

        updateBookPosition();
    };

    var showPrivateBooks = function() {
        var peivateBooks = [],
            allBooks = booksData.getBookItems();

        allBooks.forEach(function(e) {
            if (e.type.toLowerCase() === 'private') {
                addBookToTable(e);
                peivateBooks.push(e);
            }
        });
        updateBookPosition();
        mediator.publish('updateCounter', peivateBooks);
    };

    var showPublicBooks = function() {
        var publicBooks = [];
        var allBooks = booksData.getBookItems();

        allBooks.forEach(function(e) {
            if (e.type.toLowerCase() === 'public') {
                addBookToTable(e);
                publicBooks.push(e);
            }
        });

        updateBookPosition();
        mediator.publish('updateCounter', publicBooks);
    };

    //////////// DEBUG ///////////

    var removeAllBooks = function() {
        var booksRow = document.querySelectorAll('.table-book');
        console.log(booksRow);

        booksRow.forEach(function( e ) {
            e.remove();
        });
        updateBookPosition();
    };

    //////////// DEBUG ///////////

    var removePrivateBooks = function() {
        var booksRow = document.querySelectorAll('.table-book');
        console.log(booksRow);

        booksRow.forEach(function( e ) {
            if ( e.querySelector('.type').textContent.toLowerCase() === 'private' ) {
                e.remove();
            }
        });

        updateBookPosition();
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
        if (e.target.classList.contains('js-delete-btn') ) {
            e.target.parentElement.parentElement.remove();
            booksData.removeBookItem( e.target.parentElement.parentElement.querySelector('.id').textContent );
            updateBookPosition();
            mediator.publish('updateCounter', 'delete');
        }
    };

    table.addEventListener('click', deleteBookFromTable);

    var displayBooks = function(boolean) {

        var newb = booksData.getBookItems();
        newb.forEach(function(e) {
            addBookToTable(e);
        });

        mediator.publish('updateBooks', newb);
    };

    mediator.subscribe('newBook', addBookToTable );
    mediator.subscribe('userLogin', displayBooks);
    displayBooks();

    return {
        //////////// DEBUG ///////////
        showPrivateBooks: showPrivateBooks,
        showPublicBooks: showPublicBooks,
        removePrivateBooks: removePrivateBooks,
        removeAllBooks: removeAllBooks
        //////////// DEBUG ///////////
    };

})();
