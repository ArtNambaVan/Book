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
    });

    var userLogin = function() {


        allUsers = usersData.getUsers();
        $('#loginError').hide();
        allUsers.forEach(function(user) {
            if (emailInput.value === user.email && passwordInput.value === user.password) {
                $('#loginError').hide('fade');
                $('#modalLoginForm').modal('hide');
                logInBtn.classList.toggle('d-none');
                logOutBtn.classList.toggle('d-none');
                usersData.currentUser(user);
                $('#loginError').hide('fade');
                mediator.publish('userLogIn', user);
                return;
            } else {
                console.log(loginForm);
                $('#loginError').show('fade');
                loginForm.reset();
                emailInput.focus();
            }
        });


    };

})();
