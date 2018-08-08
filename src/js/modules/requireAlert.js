var requireAlert = (function() {

    var showAlert = function() {

        $('#requireAlert').show('fade');


    };

    mediator.subscribe('mandatory', showAlert);

    var hideAlert = function() {
        $('#requireAlert').hide();
    };

    mediator.subscribe('hideMandatory', hideAlert);
})();
