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

            var name      = document.querySelector(DOMstrings.inputName).value;
            var email     = document.querySelector(DOMstrings.inputEmail).value;
            var password  = document.querySelector(DOMstrings.inputPassword).value;

            var allUsers = usersDate.getUsers();

            allUsers.forEach(function(el) {
                if (el.name === name && el.email === email && el.password === password) {

                    $('#modalLoginForm').modal("hide");
                    alert('Welcome');
                }
            })
        }

        return {
            getDOMstrings: function() {
                return DOMstrings;
            }
        }

    })();




    var mediator = (function() {

    })();


});
