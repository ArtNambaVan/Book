var requireAlert = (function() {

    var showAlert = function() {

        $('#requireAlert').show('fade');

        setTimeout(function() {
            $('#requireAlert').hide('fade');
        }, 2000);
    };

    mediator.subscribe('mandatory', showAlert);
})();
