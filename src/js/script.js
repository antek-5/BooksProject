
const select = {
    templateOf: {
        book: '#template-book'
    },
    booksList: '.books-list',
    bookImages: '.books-list .book__image',

    filters: '.filters'
};


const templates = {
    books: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML)
};

///

class BooksList {
    constructor() {
        
        BooksList.favoriteBooks = [];
        BooksList.filtersArray = [];

        this.initData();
        this.getElements();

        this.render();
        this.initActions();

    }

    initData() {
        this.data = dataSource.books;
    }

    getElements() {
        
        this.bookContainer = document.querySelector(select.booksList);
        this.booksList = document.querySelector(select.booksList);
        this.filters = document.querySelector(select.filters);
  
    }

    render() {

        for (const book of this.data) {

            /* RATING */
            book.ratingBgc = this.determineRatingBgc(book.rating);
            book.ratingWidth = book.rating * 10;

            /* REST */
            const generatedHTML = templates.books(book);    
            const bookElement = utils.createDOMFromHTML(generatedHTML);
            const bookContainer = this.bookContainer;
            bookContainer.appendChild(bookElement);

        }
    }

    initActions() {
        const thisBooksList = this;

        const booksList = this.booksList;
        booksList.addEventListener('dblclick', function(event) {
            event.preventDefault();
    
            if(event.target.offsetParent.classList.contains('book__image')) {
    
                const bookId = event.target.offsetParent.getAttribute('data-id');

    
                if(!BooksList.favoriteBooks.includes(bookId)) {
    
                    event.target.offsetParent.classList.add('favorite');
                    BooksList.favoriteBooks.push(bookId);
    
                } else {
    
                    event.target.offsetParent.classList.remove('favorite');
                    const indexToRemove = BooksList.favoriteBooks.indexOf(bookId);
                    BooksList.favoriteBooks.splice(indexToRemove, 1);
                    
                }                
            }
        });
    
        const filters = this.filters;
        filters.addEventListener('click', function(event) {
    
            const tagName = event.target.tagName;
            const type = event.target.getAttribute('type');
            const name = event.target.getAttribute('name');
    
            if(tagName == 'INPUT' && type == 'checkbox' && name == 'filter') {    
                if(event.target.checked) {
                    BooksList.filtersArray.push(event.target.value);
                } else {
                    const indexToRemoveFilters = BooksList.filtersArray.indexOf(event.target.value);
                    BooksList.filtersArray.splice(indexToRemoveFilters);
                }
            }
            thisBooksList.filterBooks();
    
        });
    }

    filterBooks() {

        for (const book of this.data) {

            let shouldBeHidden = false;
            for (const filter of BooksList.filtersArray) {
    
                if(book.details.hasOwnProperty(filter)) {
    
                    if(!book.details[filter]) {
                        shouldBeHidden = true;
                        break;
                    }
                }
            }
    
            const bookImg = document.querySelector('[data-id="' + book.id + '"]');
            if(shouldBeHidden) {
                bookImg.classList.add('hidden');
            } else {
                bookImg.classList.remove('hidden');
            }
        }
    }

    determineRatingBgc(rating) {
        
        if(rating < 6) {
            return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
        } else if (rating < 9) {
            return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
        } else if (rating == 9) {
            return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
        } else {
            return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
        }
    }
}

const app = new BooksList();