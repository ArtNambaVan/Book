var counterController = (function() {
    var counter = document.querySelector( '.js-count' );
    var count = 0;

    var publicBooksCounter = function( arr ) {
        count = arr.length;
        counter.textContent = count;
        return count;
    };

    var allBooksCounter = function( arr ) {
        count = arr.length;
        counter.textContent = count;
        return count;
    };

    var updateCounter = function() {
        count ++;
        counter.textContent = count;
        return count;
    };

    var removeCounter = function( arr ) {
        count -= arr.length;
        counter.textContent = count;
        return count;
    };

    mediator.subscribe( 'countPublicBooks', publicBooksCounter );
    mediator.subscribe( 'countAllBooks', allBooksCounter );
    mediator.subscribe( 'updateCounter', updateCounter );
    mediator.subscribe( 'removeCounter', removeCounter );

})();
