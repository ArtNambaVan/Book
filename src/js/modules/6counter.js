var counterController = (function() {
    var counter = document.querySelector('.js-count');

    var count = 0;
    var addCounter = function( obj ) {
        count++;
        counter.textContent = count;
    };

    var updateCounter = function(obj) {
        obj.forEach(function( e ) {
            count++;
        });

        counter.textContent = count;
    };

    mediator.subscribe('newBook', addCounter );
    mediator.subscribe('updateBooks', updateCounter );
})();
