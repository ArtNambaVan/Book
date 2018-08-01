
var mediator = (function() {

    var subscribers = {};


    return {
    //    subscribers,
        subscribe : function(eventName, fn) {
            subscribers[eventName] = subscribers[eventName] || [];
            subscribers[eventName].push(fn);
        },

        unsubscribe : function(eventName,fn) {
            // code
        },

        publish : function(eventName, data) {
            if (subscribers[eventName]) {
                subscribers[eventName].forEach(function(fn) {
                    fn(data)
                })
            }
        }
    }

})();


var usersData = (function() {
    var users, obj, obj1;

    users = [];
    obj = {
        name     : 'Artem',
        email    : 'Arthorror@gmail.com',
        password : 'Anthrax1'
    }
    obj1 = {
        name     : 'Vadim',
        email    : 'Vadim@gmail.com',
        password : 'Vadim123'
    }

    users.push(obj,obj1);

    return {
        getUsers: function() {
            return users;
        }
    }

})();


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


var usersController = (function() {

    var email  = document.querySelector('#inputEmail').value,
    password   = document.querySelector('#inputPassword').value,
    loginForm  = document.querySelector('#login-form'),
    allUsers
    ;


    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkUser();

    })


    var checkUser = function() {


        allUsers = usersDate.getUsers();

        for (var i = 0; i < allUsers.length; i++) {
            if (email === allUsers[i].email && password === allUsers[i].password) {
                $('#modalLoginForm').modal("hide");
                alert('hello ' + allUsers[i].name);
                mediator.publish('userLogin', true);
            }
        }
    }
})();


var bookController = (function(){

    var bookForm        = document.getElementById('book-form'),
        title           = bookForm.querySelector('.js-title'),
        description     = bookForm.querySelector('.js-description'),
        author          = bookForm.querySelector('.js-author'),
        genre           = bookForm.querySelector('.js-genre'),
        type            = bookForm.querySelectorAll('input[type="radio"]'),
        typeNew
        ;




    showForm = function() {
        bookForm.classList.toggle('d-none');
    }

    bookForm.addEventListener('submit', function(e) {
      e.preventDefault();
      createBook();
    })

    createBook = function() {

        type.forEach(function(el) {
            if (el.checked) {
                typeNew = el.value;
                return typeNew;
            }
        });
        console.log(title)
        // get value
        if (title.value !== '' && description.value !== '' && genre !== '') {

            var date = new Date();
            var h = date.getHours();
            var m = date.getMinutes();
            date = h + ":" + m;

            var bookItem = {
                title: title.value,
                description: description.value,
                author: author.value,
                genre: genre.value,
                type: typeNew,
                date: date
            }
        }

        // add book to bookData
        var newItem = booksData.addBookItem(bookItem);

        addListItem(newItem)
    }


    addListItem = function(obj) {

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

    }

    return {
        showForm: function(data) {
            if(data)
            bookForm.classList.toggle('d-none');
        },

        addListItem : function(obj) {

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

        },

        deleteListItem : function() {},

        localStorageOnLoad : function() {

        },


        clearFields: function() {}

    }


})()



var init = (function() {
    //mediator.subscribe( 'userLogin', showForm );
    mediator.subscribe('greetings', function(arg) {

        console.log(arg, 'num')
    })

    //booksData.booksInit();

    booksData.localStorageOnLoad()

})();


