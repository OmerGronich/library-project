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
      <li>${this.title}</li>
      <li>${this.author}</li>
      <li>${this.numOfPages}</li>
      <li data-readstatus>${this.haveRead}</li>
      <button class="remove-book-btn">X</button>
    `;
    this.addListeners();
  }

  addListeners() {
    this.bookElement.querySelector('[data-readstatus]').addEventListener('click', UI.toggleReadStatus);
  }
}

// UI class
class UI {

  static displayBooks() {
    bookContainer.innerHTML = '';
    myLibrary = Store.getBooks();
    myLibrary.forEach((book) => {
      bookContainer.appendChild(book.bookElement)
      removeBookBtn = document.querySelectorAll('.remove-book-btn')
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
    UI.displayBooks();
  }

  static toggleReadStatus(el) {
    if (el.target.innerText === 'Read') {
      el.target.innerText = 'Reading';
    } else if (el.target.innerText === 'Reading') {
      el.target.innerText = 'Not Read'
    } else {
      el.target.innerText = 'Read';
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
        UI.displayBooks();
      }
    }
    console.log(el.parentElement.children[0].innerText);
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
