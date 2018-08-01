var bookController = (function(){

    var bookForm        = document.getElementById('book-form'),
        title           = bookForm.querySelector('.js-title'),
        description     = bookForm.querySelector('.js-description'),
        author          = bookForm.querySelector('.js-author'),
        genre           = bookForm.querySelector('.js-genre'),
        type            = bookForm.querySelectorAll('input[type="radio"]'),
        typeNew
        ;




    showForm = function() {
        bookForm.classList.toggle('d-none');
    }

    bookForm.addEventListener('submit', function(e) {
      e.preventDefault();
      createBook();
    })

    createBook = function() {

        type.forEach(function(el) {
            if (el.checked) {
                typeNew = el.value;
                return typeNew;
            }
        });
        console.log(title)
        // get value
        if (title.value !== '' && description.value !== '' && genre !== '') {

            var date = new Date();
            var h = date.getHours();
            var m = date.getMinutes();
            date = h + ":" + m;

            var bookItem = {
                title: title.value,
                description: description.value,
                author: author.value,
                genre: genre.value,
                type: typeNew,
                date: date
            }
        }

        // add book to bookData
        var newItem = booksData.addBookItem(bookItem);

        addListItem(newItem)
    }


    addListItem = function(obj) {

        var bookList = document.querySelector('.table-group');
        var tmpl = document.getElementById('comment-template').content.cloneNode(true);
        tmpl.querySelector('.id').innerText = obj.id;
        //tmpl.querySelector('.position').innerText = comment.position;
        tmpl.querySelector('.title').innerText = obj.title;
        tmpl.querySelector('.description').innerText = obj.description;
        tmpl.querySelector('.author').innerText = obj.author;
        tmpl.querySelector('.date').innerText = obj.date;
        tmpl.querySelector('.genre').innerText = obj.genre;
        tmpl.querySelector('.type').innerText = obj.type;
        bookList.appendChild(tmpl);

    }

    return {
        showForm: function(data) {
            if(data)
            bookForm.classList.toggle('d-none');
        },

        addListItem : function(obj) {

                var bookList = document.querySelector('.table-group');
                var tmpl = document.getElementById('comment-template').content.cloneNode(true);
                tmpl.querySelector('.id').innerText = obj.id;
                //tmpl.querySelector('.position').innerText = comment.position;
                tmpl.querySelector('.title').innerText = obj.title;
                tmpl.querySelector('.description').innerText = obj.description;
                tmpl.querySelector('.author').innerText = obj.author;
                tmpl.querySelector('.date').innerText = obj.date;
                tmpl.querySelector('.genre').innerText = obj.genre;
                tmpl.querySelector('.type').innerText = obj.type;
                bookList.appendChild(tmpl);

        },

        deleteListItem : function() {},

        localStorageOnLoad : function() {

        },


        clearFields: function() {}

    }


})()
