var requireAlert = (function() {

    var showAlert = function() {

        $('#requireAlert').show('fade');

        setTimeout(function() {
            $('#requireAlert').hide('fade');
        }, 1000);
    };

    mediator.subscribe('mandatory', showAlert);
})();
