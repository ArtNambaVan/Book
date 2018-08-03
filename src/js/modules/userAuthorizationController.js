var userAuthorizationController = (function() {

    var emailInput      = document.getElementById( 'email-input' ),
        passwordInput   = document.getElementById( 'password-input' ),
        loginForm       = document.getElementById( 'login-form' ),
        logOutBtn       = document.querySelector( '.js-logout' )
    ;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkUser();

    });

    logOutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    var checkUser = function() {
        var allUsers;

        allUsers = usersData.getUsers();

        for (var i = 0; i < allUsers.length; i++) {
            if (emailInput.value === allUsers[i].email && passwordInput.value === allUsers[i].password) {
                $( '#modalLoginForm' ).modal( 'hide' );
                alert('hello ' + allUsers[i].name);
                mediator.publish('userLogin', true);
            }
        }
    };

    var logout = function() {
        mediator.publish('userLogin', false);
    };


})();
