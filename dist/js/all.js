var mediator = (function() {

    var subscribers = {};


    return {
    //    subscribers,
        subscribe : function(eventName, fn) {
            subscribers[eventName] = subscribers[eventName] || [];
            subscribers[eventName].push(fn);
        },


        publish : function(eventName, data) {
            if (subscribers[eventName]) {
                subscribers[eventName].forEach(function(fn) {
                    fn(data);
                });
            }
        }
    };

})();

var usersData = (function() {
    var users, obj, obj1;

    users = [];
    obj = {
        name     : 'Artem',
        email    : 'Arthorror@gmail.com',
        password : 'Anthrax1'
    };
    obj1 = {
        name     : 'Vadim',
        email    : 'Vadim@gmail.com',
        password : 'Vadim123'
    };

    users.push( obj,obj1 );

    return {
        getUsers: function() {
            return users;
        }
    };

})();

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

var userAuthorizationController = (function() {

    var emailInput  = document.querySelector( '#inputEmail' ),
        passwordInput   = document.querySelector( '#inputPassword' ),
        loginForm  = document.querySelector( '#login-form' ),
        allUsers
    ;


    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkUser();

    });


    var checkUser = function() {

        allUsers = usersData.getUsers();

        for (var i = 0; i < allUsers.length; i++) {
            if (emailInput.value === allUsers[i].email && passwordInput.value === allUsers[i].password) {
                $( '#modalLoginForm' ).modal( 'hide' );
                alert('hello ' + allUsers[i].name);
                mediator.publish('userLogin', true);
            }
        }
    };
})();

var booksFormController = (function(){

    var bookForm        = document.getElementById('book-form'),
        title           = bookForm.querySelector('.js-title'),
        description     = bookForm.querySelector('.js-description'),
        author          = bookForm.querySelector('.js-author'),
        genre           = bookForm.querySelector('.js-genre'),
        type            = bookForm.querySelectorAll('input[type="radio"]'),
        typeNew
        ;

    var showForm = function() {
        bookForm.classList.toggle( 'd-none' );
    };

    mediator.subscribe('userLogin', showForm);

    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createBook();
    });

    var createBook = function() {

        type.forEach(function( el ) {
            if ( el.checked ) {
                typeNew = el.value;
                return typeNew;
            }
        });

        if (title.value !== '' && description.value !== '' && genre !== '') {

            var date = new Date();
            var h = date.getHours();
            var m = date.getMinutes();
            date = h + ':' + m;

            var bookItem = {
                title: title.value,
                description: description.value,
                author: author.value,
                genre: genre.value,
                type: typeNew,
                date: date
            };
        }


        var newItem = booksData.addBookItem(bookItem);


        mediator.publish( 'newBook', newItem );
    };

})();

var counterController = (function() {
    var counter = document.querySelector('.js-count');

    var count = 0;
    var addCounter = function( obj ) {
        count++;
        counter.textContent = count;
    };

    var updateCounter = function(obj) {
        obj.forEach(function( e ) {
            count++;
        });

        counter.textContent = count;
    };

    mediator.subscribe('newBook', addCounter );
    mediator.subscribe('updateBooks', updateCounter );
})();

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