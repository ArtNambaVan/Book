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
