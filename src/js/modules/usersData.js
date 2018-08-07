var usersData = (function() {


    var users, user1, user2;

    users = [];
    user1 = {
        id       : 1,
        name     : 'Artem',
        email    : 'Arthorror@gmail.com',
        password : 'Anthrax1'
    };
    user2 = {
        id       : 2,
        name     : 'Vadim',
        email    : 'Vadim@gmail.com',
        password : 'Vadim123'
    };

    users.push(user1,user2);


    var getUserFromLocalStorage = function() {
        var users,
            usersLS = localStorage.getItem('users');

        if( usersLS === null ) {
            users = [];
        } else {
            users = JSON.parse(usersLS);
        }
        return users;
    };

    var addUserToLocalStorage = function(user) {
        var users = getUserFromLocalStorage();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    };


    var addUserID = function( ID ) {
        var IDs = getUserID();

        IDs.push( ID );
        localStorage.setItem('ID', JSON.stringify(IDs));
    };



    return {
        getUsers: function() {
            return users;
        },

        getCurrentUser: function() {
            var user,
                currUser = localStorage.getItem('currentUser');

            if( currUser === null ) {
                user = null;
            } else {
                user = JSON.parse(currUser);
            }
            return user;
        },

        currentUser: function (user) {
            var currUser = [];
            currUser.push(user);
            localStorage.setItem('currentUser', JSON.stringify(currUser));
        },

        deleteCurrentUser: function () {
            localStorage.removeItem('currentUser');
        }
    };

})();
