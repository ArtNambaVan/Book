var counterController = (function() {
    var counter = document.querySelector('.js-count');
    var count = 0;

    var updateCounter = function(arr) {
        console.log(arr)
        count += arr.length

        counter.textContent = count;
    };

    mediator.subscribe('updateCounter', updateCounter );
})();
