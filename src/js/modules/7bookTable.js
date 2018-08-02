var bookTableController = (function() {

    var table = document.querySelector('.books');

    table.addEventListener('click', deleteBookFromTable);

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
        bookList.appendChild(tmpl);
        mediator.publish('updateBooks', 'plus');
    };

    mediator.subscribe('newBook', addBookToTable );

    var deleteBookFromTable = function(e) {
        if (e.target.classList.contains('js-delete-btn') ) {
            e.target.parentElement.parentElement.remove();
            booksData.removeBookItem( e.target.parentElement.parentElement.querySelector('.id').textContent );
            mediator.publish('updateBooks', 'delete');
        }
    };

    table.addEventListener('click', deleteBookFromTable);

    var displayBooks = function(boolean) {

        if(!boolean) {
            var newb = booksData.getBookItems();
            newb.forEach(function(e) {
                if (e.type === 'publick') {
                    addBookToTable(e);
                } else if (e.type === 'private') {
                    addBookToTable(e);
                }
            });

            mediator.publish('updateBooks', newb);
        }
    };

    mediator.subscribe('userLogin', displayBooks);
    displayBooks();

})();
