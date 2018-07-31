
var mediator = (function() {

    var subscribers = {};

    var subscribe = function(eventName, fn) {
        mediator.subscribers = subscribers;
        mediator.subscribers[eventName] = mediator.subscribers[eventName] || [];
        mediator.subscribers[eventName].push(fn);
    }

    var unsubscribe = function(eventName,fn) {
        // code
    }

    var publish = function(eventName, data) {
        if (mediator.subscribers[eventName]) {
            mediator.subscribers[eventName].forEach(function(fn) {
                fn(data)
            })
        }
    }

    return {
    //    subscribers,
        subscribe: subscribe,
        publish: publish
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

       var Private = function(id, obj) {
           this.id = id;
           this.title = obj.title;
           this.description = obj.description;
           this.genre = obj.genre;
           this.date = obj.date;
           this.type = obj.type;
       };

       var Public = function(id, obj) {
           this.id = id;
           this.title = obj.title;
           this.description = obj.description;
           this.genre = obj.genre;
           this.date = obj.date;
           this.type = obj.type;
       };


        var data = {
            allBooks: {
                private: [],
                public: []
            },
            totals: {
                private: 0,
                public: 0
            }
        }

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

            var newItem, ID;
            // ID = last ID + 1

            // Create new ID
            if (data.allBooks[obj.type].length > 0) {
                ID = data.allBooks[obj.type][data.allBooks[obj.type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //
            if (obj.type === 'private') {
                newItem = new Private(ID, obj);
            } else if (obj.type === 'public') {
                newItem = new Public(ID, obj);
            }

            // Push it into our data structure

            data.allBooks[obj.type].push(newItem);

            addBookLocalStorage(newItem);

            // Return the new element
            return newItem;
        },

        testing: function() {
            console.log(data);
        },

        testing2: function() {
           var books = getBookLocalStorage();
           books.forEach(function(el) {
                if(el.type === 'private') {
                    data.allBooks.private.push(el);
                } else if (el.type === 'public') {
                    data.allBooks.public.push(el);
                }
           })
        }
    }

})();


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
                mediator.publish('userLogin', true);
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
        typeNew;




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

        // get value
        if (title.value !== '' && description.value !== '' && genre !== '') {

            var date = new Date();
            date = date.getMinutes();

            var bookItem = {
                title: title.value,
                description: description.value,
                genre: genre.value,
                type: typeNew,
                date: date
            }
        }

        // add book to bookData

        booksData.addBookItem(bookItem);



  }

    return {
    showForm: function(data) {
        if(data)
        bookForm.classList.toggle('d-none');
    },

    deleteListItem : function(){},


    clearFields: function() {
        var fields, fieldsArr;

        fields = [title, description, genre]

        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach(function(current) {
            current.value = "";
        });

        fieldsArr[0].focus();
    }
  }


})()



var init = (function() {
    //mediator.subscribe( 'userLogin', showForm );
    mediator.subscribe('greetings', function(arg) {

        console.log(arg, 'num')
    })

    /*mediator.subscribe( 'createBook', bookController.clearFields() );*/
})();




/*    mediator.subscribe('userLogin', function(count) {
    alert(count)
})*/


/*var books = [
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
}*/











