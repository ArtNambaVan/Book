var booksData = (function() {
    var counter = 0;
    var Book = function( id, obj ) {
        this.name = counter++;
        this.id = id;
        this.title = obj.title;
        this.description = obj.description;
        this.author = obj.author;
        this.genre = obj.genre;
        this.date = obj.date;
        this.type = obj.type;
    };

    var getBookFromLocalStorage = function() {
        var books,
            booksLS = localStorage.getItem( 'books' );

        if( booksLS === null ) {
            books = [];
        } else {
            books = JSON.parse( booksLS );
        }
        return books;
    };

    var addBookToLocalStorage = function( book ) {
        var books = getBookFromLocalStorage();
        books.push(book);
        localStorage.setItem( 'books', JSON.stringify(books) );
    };

    return {

        addBookItem: function( obj ) {
            var data = getBookFromLocalStorage();
            var newItem, ID;

            if (data.length > 0) {
                ID = data[data.length - 1].id + 1;
            } else {
                ID = 0;
            }

            newItem = new Book( ID, obj );

            addBookToLocalStorage( newItem );

            return newItem;
        },

        localStorageOnLoad: function() {
            var books = getBookFromLocalStorage();

            return books;
        },

        removeBookFromLocalStorage : function(id) {
            var books = getBookFromLocalStorage();

            books.forEach(function( el, index ) {
                if ( el.id == id ) {
                    books.splice( index, 1 );
                }
            });

            localStorage.setItem( 'books', JSON.stringify(books) );
        }
    };
})();
