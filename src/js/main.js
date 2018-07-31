
    var mediator = (function() {

        var subscribers = {};

        var subscribe = function(eventName, fn) {
            this.subscribers[eventName] = this.subscribers[eventName] || [];
            this.subscribers[eventName].push(fn);
        }

        var unsubscribe = function(eventName,fn) {
            // code
        }

        var publish = function(eventName, data) {
            if (this.subscribers[eventName]) {
                this.subscribers[eventName].forEach(function(fn) {
                    fn(data)
                })
            }
        }

        return {
            subscribers,
            subscribe: subscribe,
/*            unsubscribe: unsubscribe,*/
            publish: publish
        }

    }());



    var usersDate = (function() {
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




    var booksDate = (function() {


        var getBookLocalStorage = function() {
            var books,
            booksLS = localStorage.getItem('books');

            if( booksLS === null ) {
                books = [];
            } else {
                books = JSON.parse( booksLS )
            }

            return books;
        }

        var addBookLocalStorage = function(book) {
            var books = getBookLocalStorage();
            books.push(book)

            localStorage.setItem( 'tweets', JSON.stringify(books) );
        }

        return {
            getBookLocalStorage: getBookLocalStorage(),
            addBookLocalStorage : addBookLocalStorage()
        }

    })()


    var usersController = (function() {

        var DOMstrings = {
            inputEmail    : '#inputEmail',
            inputPassword : '#inputPassword',
            loginForm     : '#login-form'
        }

        var loginForm  = document.querySelector(DOMstrings.loginForm);

            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                checkUser();

            })


        var checkUser = function() {

            var email     = document.querySelector(DOMstrings.inputEmail).value;
            var password  = document.querySelector(DOMstrings.inputPassword).value;

            var allUsers = usersDate.getUsers();

            for (var i = 0; i < allUsers.length; i++) {
                if (email === allUsers[i].email && password === allUsers[i].password) {
                    $('#modalLoginForm').modal("hide");
                    alert('hello ' + allUsers[i].name);
                    mediator.publish('userLogin', 'data')
                }
            }
        }
    })();


    var bookController = (function(){

        var title           = document.querySelector('#title'),
            description     = document.querySelector('#description'),
            genre           = document.querySelector('#genre'),
            type            = document.querySelectorAll('input[name="type"]'),
            bookForm        = document.querySelector('#book-form'),
            typeValue;


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
            typeValue = el;
            }
        })

        var books = [
            {'id': 3, 'position': 3, 'title': 'Some title', 'description': 'some description', 'author': 'some author',  'date': 'date', 'genre': 'genre', 'type': 'private'}
        ];


        var bookList = document.querySelector('.table-group');


        for (var i = 0; i < books.length; i++) {
            var comment = books[i];
            var tmpl = document.getElementById('comment-template').content.cloneNode(true);
            tmpl.querySelector('.id').innerText = comment.id;
            tmpl.querySelector('.position').innerText = comment.position;
            tmpl.querySelector('.title').innerText = comment.title;
            tmpl.querySelector('.description').innerText = comment.description;
            tmpl.querySelector('.author').innerText = comment.author;
            tmpl.querySelector('.date').innerText = comment.date;
            tmpl.querySelector('.genre').innerText = comment.genre;
            tmpl.querySelector('.type').innerText = comment.type;
            bookList.appendChild(tmpl);
        }

      }

        return {
        showForm: function(data) {
            if(data)
            bookForm.classList.toggle('d-none');
        }
      }


    })()




    var init = (function() {
        mediator.subscribe( 'userLogin', showForm );
        mediator.subscribe('greetings', function(arg) {
            this.name = arg;
            console.log(arg)
        })
    })();




/*    mediator.subscribe('userLogin', function(count) {
        alert(count)
    })*/


