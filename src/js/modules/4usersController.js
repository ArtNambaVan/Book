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
