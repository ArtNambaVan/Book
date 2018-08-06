var successAlert = (function() {

    var showAlert = function(obj) {


        var tmpl = $('#user-name-template').html();
        var html = Mustache.to_html(tmpl, obj);

        $('#user-name').html(html);

        $('#successAlert').show('fade');
        setTimeout(function() {
            $('#successAlert').hide('fade');
        }, 2000);
    };

    mediator.subscribe('userLogIn', showAlert);
})();
