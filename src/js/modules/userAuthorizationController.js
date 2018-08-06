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
        usersData.deleteCurrentUser();
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
                usersData.currentUser(user);
                mediator.publish('userLogIn', user);
            }
        });

    };

})();
