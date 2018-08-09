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

var bookCounter = (function() {
    var counter = document.querySelector('.js-count');
    var count = 0;

    var publicBooksCounter = function(books) {
        count = books.length;
        counter.textContent = count;
        return count;
    };

    var allBooksCounter = function(books) {
        count = books.length;
        counter.textContent = count;
        return count;
    };

    var increaseCounter = function() {
        count ++;
        counter.textContent = count;
        return count;
    };

    var reduceCount = function() {
        count--;
        counter.textContent = count;
        return count;
    };

    var removeCounter = function(books) {
        count -= books.length;
        counter.textContent = count;
        return count;
    };

    mediator.subscribe('countPublicBooks', publicBooksCounter);
    mediator.subscribe('countAllBooks', allBooksCounter);
    mediator.subscribe('increaseCounter', increaseCounter);
    mediator.subscribe('reduceCount', reduceCount);
    mediator.subscribe('removeCounter', removeCounter);


})();

var booksFormController = (function() {

    var bookForm = document.getElementById('book-form');

    var createForm = function() {
        var $tmpl     = $('#temp').html(),
            $bookForm = $('#book-form'),
            html
        ;

        html = Mustache.to_html($tmpl);
        $bookForm.html(html).hide().fadeIn(1000);

        addListenerOnGenreBtn();
    };

    var addListenerOnGenreBtn = function() {
        var $arrow = $('#book-form').find('.toggle-arrow'),
            $panel = $('#book-form').find('.panel')
        ;
        $panel.hide();

        $arrow.on('click', function() {
            $panel.toggle('slow');
        });
    };

    var removeForm = function() {
        $('#book-form').children().fadeOut(500,function(){
            $(this).remove();
        });
    };

    mediator.subscribe('userLogIn', createForm);
    mediator.subscribe('userSession', createForm);
    mediator.subscribe('userLogOut', removeForm);

    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createBook();
    });

    var createBook = function() {
        var inputTitle           = bookForm.querySelector('.js-title'),
            inputDescription     = bookForm.querySelector('.js-description'),
            inputType            = bookForm.querySelectorAll('input[type="radio"]'),
            inputCheckbox        = bookForm.querySelectorAll('.genre-checkbox'),
            genre                = '',
            type, now, date, user, author
            ;

        user = usersData.getCurrentUser()[0];
        author = user.name;

        inputType.forEach(function(el) {
            if (el.checked) {
                type = el.value;
                return type;
            }
        });

        inputCheckbox.forEach(function(el) {
            if (el.checked) {
                genre += el.value + ' ';
            }
            return genre;
        });

        if (inputTitle.value !== '' && inputDescription.value !== '' && genre !== '') {

            now = new Date();
            date = now.getHours() + ':' + now.getMinutes();

            var bookItem = {
                title: inputTitle.value,
                description: inputDescription.value,
                author: author,
                genre: genre,
                type: type,
                date: date
            };
            bookForm.reset();

            var newItem = booksData.addBookItem(bookItem);

            mediator.publish('newBook', newItem);
            mediator.publish('hideMandatory');
        } else {
            mediator.publish('mandatory');
        }
    };
})();

var booksData = (function() {

    var Book = function(id, obj) {
        this.id = id;
        this.position = -1;
        this.title = obj.title;
        this.description = obj.description;
        this.author = obj.author;
        this.genre = obj.genre;
        this.date = obj.date;
        this.type = obj.type;
    };

    var getBookFromLocalStorage = function() {
        var books,
            booksLS = localStorage.getItem('books');

        if(booksLS === null) {
            books = [];
        } else {
            books = JSON.parse(booksLS);
        }
        return books;
    };

    var addBookToLocalStorage = function(book) {
        var books = getBookFromLocalStorage();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    };

    var getBookID = function() {
        var IDs,
            IDLS = localStorage.getItem('ID');

        if (IDLS === null) {
            IDs = [];
        } else {
            IDs = JSON.parse (IDLS);
        }
        return IDs;

    };

    var addBookID = function(ID) {
        var IDs = getBookID();

        IDs.push(ID);
        localStorage.setItem('ID', JSON.stringify(IDs));
    };

    return {

        addBookItem: function(obj) {
            var IDs   = getBookID(),
                newItem, newID;

            if (IDs.length > 0) {
                newID = IDs.length;
            } else {
                newID = 0;
            }

            newItem = new Book(newID, obj);

            addBookToLocalStorage(newItem);
            addBookID(newID);

            return newItem;
        },

        getBookItems: function() {
            var books = getBookFromLocalStorage();

            return books;
        },

        removeBookItem : function(id) {
            var books = getBookFromLocalStorage();

            books.forEach(function(el, index) {
                if (el.id == id) {
                    books.splice(index, 1);
                }
            });

            localStorage.setItem('books', JSON.stringify(books));
        },

        localStorageNewPosition : function(books) {
            var oldBooks = getBookFromLocalStorage();

            oldBooks.forEach(function(e) {
                books.each(function(i) {
                    if (e.id == $(this).find('.id').text()) {
                        e.position = $(this).find('.position').text();
                    }
                });

            });

            localStorage.setItem('books', JSON.stringify(oldBooks));
        }
    };
})();

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

var cookies = (function() {

    var setCookie = function(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == 'number' && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + '=' + value;

        for (var propName in options) {
            updatedCookie += '; ' + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += '=' + propValue;
            }
        }

        document.cookie = updatedCookie;
    };

    var deleteCookie = function(name) {
        setCookie(name, '', {
            expires: -1
        });
    };

    return {
        setCookie: setCookie,
        deleteCookie: deleteCookie
    };


})();

var requireAlert = (function() {

    var showAlert = function() {

        $('#requireAlert').show('fade');


    };

    mediator.subscribe('mandatory', showAlert);

    var hideAlert = function() {
        $('#requireAlert').hide();
    };

    mediator.subscribe('hideMandatory', hideAlert);
    mediator.subscribe('userLogOut', hideAlert);
})();

var successAlert = (function() {

    var showAlert = function(obj) {


        var tmpl = '{{name}}';
        var html = Mustache.to_html(tmpl, obj);

        $('#user-name').html(html);
        $('#successAlert').show('fade');

        setTimeout(function() {
            $('#successAlert').hide('fade');
        }, 3000);
    };

    mediator.subscribe('userLogIn', showAlert);
})();

var userAuthorizationController = (function() {

    var emailInput      = document.getElementById('email-input'),
        passwordInput   = document.getElementById('password-input'),
        loginForm       = document.getElementById('login-form'),
        logOutBtn       = document.querySelector('.js-logout'),
        logInBtn        = document.querySelector('.js-login')
    ;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        userLogin();
    });

    logOutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logInBtn.classList.toggle('d-none');
        logOutBtn.classList.toggle('d-none');
        usersData.deleteCurrentUser();
        mediator.publish('userLogOut');
        cookies.deleteCookie('name');
    });

    var userLogin = function() {

        var allUsers = usersData.getUsers();

        for (var i = 0; i < allUsers.length; i++) {
            if (emailInput.value.toLowerCase() === allUsers[i].email.toLowerCase() && passwordInput.value === allUsers[i].password) {
                $('#loginError').hide('fade');
                $('#modalLoginForm').modal('hide');

                usersData.currentUser(allUsers[i]);
                $('#loginError').hide('fade');
                changeBtn();
                mediator.publish('userLogIn', allUsers[i]);
                cookies.setCookie('name', allUsers[i].name, {expires: 3600});
                return;
            }
        }

        $('#loginError').show('fade');
        loginForm.reset();
        emailInput.focus();

    };


    var changeBtn = function() {
        logInBtn.classList.toggle('d-none');
        logOutBtn.classList.toggle('d-none');
    };

    mediator.subscribe('userSession', changeBtn);

})();


var usersData = (function() {


    var users, user1, user2;

    users = [];
    user1 = {
        id       : 1,
        name     : 'User1',
        email    : 'user1@gmail.com',
        password : 'user1'
    };
    user2 = {
        id       : 2,
        name     : 'Artem',
        email    : 'Artem@gmail.com',
        password : 'artem123'
    };

    users.push(user1,user2);


    var getUserFromLocalStorage = function() {
        var users,
            usersLS = localStorage.getItem('users');

        if( usersLS === null ) {
            users = [];
        } else {
            users = JSON.parse(usersLS);
        }
        return users;
    };

    var addUserToLocalStorage = function(user) {
        var users = getUserFromLocalStorage();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    };


    var addUserID = function( ID ) {
        var IDs = getUserID();

        IDs.push( ID );
        localStorage.setItem('ID', JSON.stringify(IDs));
    };



    return {
        getUsers: function() {
            return users;
        },

        getCurrentUser: function() {
            var user,
                currUser = localStorage.getItem('currentUser');

            if( currUser === null ) {
                user = null;
            } else {
                user = JSON.parse(currUser);
            }
            return user;
        },

        currentUser: function (user) {
            var currUser = [];
            currUser.push(user);
            localStorage.setItem('currentUser', JSON.stringify(currUser));
        },

        deleteCurrentUser: function () {
            localStorage.removeItem('currentUser');
        }
    };

})();

var getCookie = (function(name){
    var matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    var userName = matches ? decodeURIComponent(matches[1]) : undefined;
    if (userName) {
        mediator.publish('userSession', userName);
    }
    return matches ? decodeURIComponent(matches[1]) : undefined;
})('name');



