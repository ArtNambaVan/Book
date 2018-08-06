var successAlert = (function() {

    var showAlert = function(obj) {
        $('#successAlert').show('fade');
        setTimeout(function() {
            $('#successAlert').hide('fade');
        }, 2000);
    };

    mediator.subscribe('userLogIn', showAlert);
})();
