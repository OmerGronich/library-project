const container = document.querySelector('.container');
const bookContainer = document.querySelector('.book-container');
const newBookBtn = document.getElementById('new-book');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const form = document.getElementById('form');
let removeBookBtn;

let myLibrary;

// Utilities
function createBookElement() {
  const bookElement = document.createElement('ul');
  bookElement.classList.add('book');
  return bookElement;
};

// Book Class.
class Book {
  constructor(title, author, numOfPages, haveRead = 'Not Read') {
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.haveRead = haveRead;
    this.bookElement = createBookElement();
    this.renderBookContents();
  }

  renderBookContents() {
    this.bookElement.innerHTML = `
      <li class="book__detail">${this.title}</li>
      <li class="book__detail">${this.author}</li>
      <li class="book__detail">${this.numOfPages}</li>
      <li class="book__detail book__read-status" data-readstatus>${this.haveRead}</li>
      <button class="btn--remove-book">X</button>
    `;
    // selecting read status li
    let readStatusElement = [...this.bookElement.children].filter(el => el.classList.contains('book__read-status'))[0];
    // Setting read-status class
    if (this.haveRead === 'Not Read') {
      readStatusElement.classList.add('book__read-status--not-read');
    } else if (this.haveRead === 'Reading') {
      readStatusElement.classList.add('book__read-status--reading');
    } else {
      readStatusElement.classList.add('book__read-status--finished');
    }

    this.addListeners();
  }

  addListeners() {
    this.bookElement.querySelector('[data-readstatus]').addEventListener('click', UI.toggleReadStatus);
  }
}

// UI class
class UI {

  static displayBooks() {
    myLibrary = Store.getBooks();
    bookContainer.innerHTML = '';
    myLibrary.forEach((book) => {
      bookContainer.appendChild(book.bookElement)
      removeBookBtn = document.querySelectorAll('.btn--remove-book')
      removeBookBtn.forEach(btn => btn.addEventListener('click', UI.removeBook))
    });
  }

  static addNewBookToLibrary(e) {
    e.preventDefault();
    const formData = new FormData(form);

    const newBook = new Book(
      formData.get('title'),
      formData.get('author'),
      formData.get('pages'),
      formData.get('readStatus')
    );

    myLibrary = Store.getBooks()

    // Making sure there are no dublicate books
    for (let i = 0; i < myLibrary.length; i++) {
      if (myLibrary[i].title === newBook.title) {
        alert('This book is already in the library!')
        modal.classList.remove('show')
        return;
      }
    }

    Store.addBook(newBook);
    UI.displayBooks();

    modal.classList.remove('show')
  }

  static removeBook(e) {
    e.target.parentElement.remove()
    Store.removeBook(e.target);
  }

  static toggleReadStatus(el) {
    if (el.target.innerText === 'Not Read') {
      el.target.innerText = 'Reading';
      el.target.classList.remove('book__read-status--not-read');
      el.target.classList.add('book__read-status--reading');
      console.log(el.target.classList);
    } else if (el.target.innerText === 'Reading') {
      el.target.innerText = 'Finished'
      el.target.classList.remove('book__read-status--reading');
      el.target.classList.add('book__read-status--finished');
      console.log(el.target.classList);
    } else {
      el.target.innerText = 'Not Read';
      el.target.classList.remove('book__read-status--finished');
      el.target.classList.add('book__read-status--not-read');
      console.log(el.target.classList);
    };

    Store.toggleReadStatus(el.target);

  }
}

// Local storage class
class Store {

  static getBooks() {
    if (localStorage.getItem('myLibrary') === null) {
      myLibrary = [];
    } else {
      myLibrary = JSON.parse(localStorage.getItem('myLibrary'));
      myLibrary = myLibrary.map(book => new Book(book.title, book.author, book.numOfPages, book.haveRead))
    }
    return myLibrary;
  }

  static addBook(book) {
    myLibrary = Store.getBooks();
    book = new Book(book.title, book.author, book.numOfPages, book.readStatus);
    myLibrary.push(book);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary))
  }

  static removeBook(el) {
    myLibrary = Store.getBooks();
    myLibrary = myLibrary.filter(book => !el.parentElement.innerHTML.includes(book.title))
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  }

  static toggleReadStatus(el) {
    myLibrary = Store.getBooks();
    for (let i = 0; i < myLibrary.length; i++) {
      if (myLibrary[i].haveRead !== el.parentElement.children[0].innerText && myLibrary[i].title === el.parentElement.children[0].innerText) {
        myLibrary[i].haveRead = el.innerText;
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
      }
    }

  }
}

/* Event listeners */

// Show Modal
newBookBtn.addEventListener('click', () => {
  modal.classList.add('show');
});

// Close modal 
closeModal.addEventListener('click', () => {
  modal.classList.remove('show');
});

// Submit book
form.addEventListener('submit', UI.addNewBookToLibrary)

// DOM Load Event 
document.addEventListener('DOMContentLoaded', UI.displayBooks)
