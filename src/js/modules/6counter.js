var counterController = (function() {
    var counter = document.querySelector('.js-count');
    var count = 0;

    var updateCounter = function(data) {

        if ( typeof(data) === 'object' ) {
            count = data.length;
        } else {
            if (data === 'delete') {
                count--;
            } else if (data === 'plus') {
                count++;
            }
        }

        counter.textContent = count;
    };

    mediator.subscribe('updateBooks', updateCounter );
})();
