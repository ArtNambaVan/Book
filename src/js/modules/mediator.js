var mediator = (function() {

    var subscribers = {};

    return {
        subscribe : function(eventName, fn) {
            subscribers[eventName] = subscribers[eventName] || [];
            subscribers[eventName].push(fn);
        },

        publish : function(eventName, data) {
            if (subscribers[eventName]) {
                subscribers[eventName].forEach(function(fn) {
                    if (typeof fn === 'object') {
                        fn.forEach(function(item) {
                            item(data)
                        })

                    } else {
                        fn(data);
                        console.log(fn)
                    }
                });
            }
        }
    };

})();
