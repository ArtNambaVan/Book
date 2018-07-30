$(document).ready(function(){


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



    var usersController = (function() {

        var DOMstrings = {
            inputName     : '#inputName',
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
                    return
                }
            }

        }

        return {
            getDOMstrings: function() {
                return DOMstrings;
            }
        }

    })();

    var bookController = (function(){

      var title           = document.querySelector('#title');
      var description     = document.querySelector('#description');
      var genre           = document.querySelector('#genre');
      var type            = document.querySelectorAll('input[name="type"]');
      var bookForm        = document.querySelector('#book-form');
      var typeValue;


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

        // Get a reference to the comments list in the main DOM.
        var bookList = document.querySelector('.table-group');

        // Loop through each of the comments and add them to the comments list.
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


    })()





    var mediator = (function() {

    })();


});
