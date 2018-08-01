var mediator = (function() {

    var subscribers = {};


    return {
    //    subscribers,
        subscribe : function(eventName, fn) {
            subscribers[eventName] = subscribers[eventName] || [];
            subscribers[eventName].push(fn);
        },

        unsubscribe : function(eventName,fn) {
            // code
        },

        publish : function(eventName, data) {
            if (subscribers[eventName]) {
                subscribers[eventName].forEach(function(fn) {
                    fn(data)
                })
            }
        }
    }

})();