var booksData = (function() {
    var counter = 0;
       var Book = function(id, obj) {
           this.name = counter++;
           this.id = id;
           this.title = obj.title;
           this.description = obj.description;
           this.author = obj.author;
           this.genre = obj.genre;
           this.date = obj.date;
           this.type = obj.type;
       };

        /*var data = {
            allBooks: {
                books: []
            },
            totals: {
                private: 0,
                public: 0
            }
        }*/

    var getBookLocalStorage = function() {
        var books,
        booksLS = localStorage.getItem('books');

        if( booksLS === null ) {
            books = [];
        } else {
            books = JSON.parse( booksLS );
        }
        return books;
    };

    var addBookLocalStorage = function(book) {
        var books = getBookLocalStorage();
        books.push(book);
        localStorage.setItem( 'books', JSON.stringify(books) );
    };

    return {

        addBookItem: function(obj) {
            var data = getBookLocalStorage();
            var newItem, ID;


            // ID = last ID + 1
            if (data.length > 0) {
                ID = data[data.length - 1].id + 1;
            } else {
                ID = 0;
            }

            newItem = new Book(ID, obj)


            //data.allBooks['books'].push(newItem);

            addBookLocalStorage(newItem);

            return newItem;
        },

        localStorageOnLoad: function() {
            var books = getBookLocalStorage();

            books.forEach(function(el) {
                bookController.addListItem(el);
            })

        },

        testing: function() {
            console.log(data);
        }
    }

})();
