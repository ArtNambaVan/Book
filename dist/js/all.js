var mediator = (function() {

    var subscribers = {};

    return {
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

var counterController = (function() {
    var counter = document.querySelector( '.js-count' );
    var count = 0;

    var publicBooksCounter = function( arr ) {
        count = arr.length;
        counter.textContent = count;
        return count;
    };

    var allBooksCounter = function( arr ) {
        count = arr.length;
        counter.textContent = count;
        return count;
    };

    var updateCounter = function() {
        count ++;
        counter.textContent = count;
        return count;
    };

    var removeCounter = function( arr ) {
        count -= arr.length;
        counter.textContent = count;
        return count;
    };

    mediator.subscribe( 'countPublicBooks', publicBooksCounter );
    mediator.subscribe( 'countAllBooks', allBooksCounter );
    mediator.subscribe( 'updateCounter', updateCounter );
    mediator.subscribe( 'removeCounter', removeCounter );

})();

var booksFormController = (function(){

    var bookForm             = document.getElementById('book-form'),
        inputTitle           = bookForm.querySelector('.js-title'),
        inputDescription     = bookForm.querySelector('.js-description'),
        inputAuthor          = bookForm.querySelector('.js-author'),
        inputGenre           = bookForm.querySelector('.js-genre'),
        inputType            = bookForm.querySelectorAll('input[type="radio"]'),
        type
        ;

    var showForm = function() {
        bookForm.classList.remove( 'd-none' );
    };

    var hideForm = function() {
        bookForm.classList.add( 'd-none' );
    };

    mediator.subscribe('userLogIn', showForm);
    mediator.subscribe('userLogOut', hideForm);

    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createBook();
    });

    var createBook = function() {
        var now, date;

        inputType.forEach(function( el ) {
            if ( el.checked ) {
                type = el.value;
                return type;
            }
        });

        if (inputTitle.value !== '' && inputDescription.value !== '' && inputGenre !== '') {

            now = new Date();
            date = now.getHours() + ':' + now.getMinutes();

            var bookItem = {
                title: inputTitle.value,
                description: inputDescription.value,
                author: inputAuthor.value,
                genre: inputGenre.value,
                type: type,
                date: date
            };
            bookForm.reset();
        }

        var newItem = booksData.addBookItem(bookItem);

        mediator.publish( 'newBook', newItem );
    };


})();

var booksData = (function() {

    var Book = function( id, obj ) {
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

    var getBookID = function() {
        var IDs,
            IDLS = localStorage.getItem( 'ID' );

        if ( IDLS === null ) {
            IDs = [];
        } else {
            IDs = JSON.parse ( IDLS );
        }
        return IDs;

    };

    var addBookID = function( ID ) {
        var IDs = getBookID();

        IDs.push( ID );
        localStorage.setItem( 'ID', JSON.stringify(IDs) );
    };

    return {

        addBookItem: function( obj ) {
            var IDs   = getBookID(),
                newItem, newID;

            if (IDs.length > 0) {
                newID = IDs.length;
            } else {
                newID = 0;
            }

            newItem = new Book( newID, obj );

            addBookToLocalStorage( newItem );
            addBookID( newID );

            return newItem;
        },

        getBookItems: function() {
            var books = getBookFromLocalStorage();

            return books;
        },

        removeBookItem : function(id) {
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

var bookTableController = (function() {

    var table = document.querySelector( '.books' );

    var addBookToTable = function( obj ) {
        var bookList = document.querySelector( '.table-group' ),
            tmpl = document.getElementById( 'comment-template' ).content.cloneNode( true );
        tmpl.querySelector( '.id' ).innerText = obj.id;
        tmpl.querySelector( '.title' ).innerText = obj.title;
        tmpl.querySelector( '.description' ).innerText = obj.description;
        tmpl.querySelector( '.author' ).innerText = obj.author;
        tmpl.querySelector( '.date' ).innerText = obj.date;
        tmpl.querySelector( '.genre' ).innerText = obj.genre;
        tmpl.querySelector( '.type' ).innerText = obj.type;
        tmpl.querySelector( '.js-delete-btn' ).addEventListener( 'click', deleteBookFromTable );
        bookList.appendChild( tmpl );

        updateBookPosition();
        mediator.publish( 'updateCounter' );
    };

    var showPrivateBooks = function() {
        var privateBooks = [],
            allBooks = booksData.getBookItems();

        allBooks.forEach(function(e) {
            if ( e.type.toLowerCase() === 'private' ) {
                addBookToTable(e);
                privateBooks.push(e);
            }
        });
        updateBookPosition();
        mediator.publish( 'countAllBooks', allBooks );
    };

    var showPublicBooks = function() {
        var publicBooks = [],
            allBooks = booksData.getBookItems();

        allBooks.forEach(function(e) {
            if ( e.type.toLowerCase() === 'public' ) {
                addBookToTable(e);
                publicBooks.push(e);
            }
        });

        updateBookPosition();
        mediator.publish( 'countPublicBooks', publicBooks );
    };

    var removePrivateBooks = function() {
        var booksRow = document.querySelectorAll( '.table-book' );
        var books = [];

        booksRow.forEach(function( e ) {
            if ( e.querySelector('.type').textContent.toLowerCase() === 'private' ) {
                books.push(e);
                e.remove();
            }
        });

        updateBookPosition();

        mediator.publish( 'removeCounter', books );
    };

    var updateBookPosition = function() {

        var bookList = document.querySelector( '.table-group' );
        Array.from(bookList.children).forEach(function(e, i) {
            var position = e.querySelector( '.position' );

            if (position != null) {
                var num = i;
                position.textContent = num;
            }
        });
    };

    var deleteBookFromTable = function(e) {
        if (e.target.classList.contains( 'js-delete-btn' ) ) {
            e.target.parentElement.parentElement.remove();
            booksData.removeBookItem( e.target.parentElement.parentElement.querySelector('.id').textContent );
            updateBookPosition();
            mediator.publish( 'updateCounter', 'delete' );
        }
    };

    showPublicBooks();
    mediator.subscribe( 'userLogIn', showPrivateBooks );
    mediator.subscribe( 'userLogOut', removePrivateBooks );
    mediator.subscribe( 'newBook', addBookToTable );

})();

var userAuthorizationController = (function() {

    var emailInput      = document.getElementById( 'email-input' ),
        passwordInput   = document.getElementById( 'password-input' ),
        loginForm       = document.getElementById( 'login-form' ),
        logOutBtn       = document.querySelector( '.js-logout' ),
        logInBtn        = document.querySelector( '.js-login' )
    ;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        userLogin();

    });

    logOutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logInBtn.classList.toggle( 'd-none' );
        logOutBtn.classList.toggle( 'd-none' );
        mediator.publish('userLogOut');
    });

    var userLogin = function() {
        var allUsers;
        allUsers = usersData.getUsers();

        allUsers.forEach(function(user) {
            if (emailInput.value === user.email && passwordInput.value === user.password) {
                $( '#modalLoginForm' ).modal( 'hide' );
                alert('hello ' + user.name);
                logInBtn.classList.toggle( 'd-none' );
                logOutBtn.classList.toggle( 'd-none' );
                mediator.publish('userLogIn', user);
            }
        });

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
