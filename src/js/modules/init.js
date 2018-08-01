var init = (function() {
    //mediator.subscribe( 'userLogin', showForm );
    mediator.subscribe('greetings', function(arg) {

        console.log(arg, 'num')
    })

    //booksData.booksInit();

    booksData.localStorageOnLoad()

})();
