var bookTableController = (function() {
    /*mediator.subscribe('newBook', function(data) {
        console.log(data)
    });*/
    var table = document.querySelector('.books');

    table.addEventListener('click', deleteBookFromTable);

    //table.addEventListener('click', function(e){console.log(e.target)})

    var addBookToTable = function(obj) {
        var bookList = document.querySelector('.table-group');
        var tmpl = document.getElementById('comment-template').content.cloneNode(true);
        tmpl.querySelector('.id').innerText = obj.id;
        //tmpl.querySelector('.position').innerText = comment.position;
        tmpl.querySelector('.title').innerText = obj.title;
        tmpl.querySelector('.description').innerText = obj.description;
        tmpl.querySelector('.author').innerText = obj.author;
        tmpl.querySelector('.date').innerText = obj.date;
        tmpl.querySelector('.genre').innerText = obj.genre;
        tmpl.querySelector('.type').innerText = obj.type;
        bookList.appendChild(tmpl);
    };

    mediator.subscribe('newBook', addBookToTable );

    var deleteBookFromTable = function(e) {
        if (e.target.classList.contains('js-delete-btn') ) {
            e.target.parentElement.parentElement.remove();
            booksData.removeBookFromLocalStorage(e.target.parentElement.parentElement.querySelector('.id').textContent);
        }

    };

    table.addEventListener('click', deleteBookFromTable);


    var onload = function() {
        var newb = booksData.localStorageOnLoad();
        newb.forEach(function(e) {

            addBookToTable(e);
        });

        mediator.publish('updateBooks', newb);
    };
    onload();

})();
