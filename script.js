const container = document.querySelector('.container');
const bookContainer = document.querySelector('.book-container');
const newBookBtn = document.getElementById('new-book');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const form = document.getElementById('form');
const filterList = document.querySelector('.side-nav__status-list')
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
      this.bookElement.children[3].classList.add('book__read-status--not-read');
    } else if (this.haveRead === 'Reading') {
      this.bookElement.children[3].classList.add('book__read-status--reading');
    } else {
      this.bookElement.children[3].classList.add('book__read-status--finished');
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
    } else if (el.target.innerText === 'Reading') {
      el.target.innerText = 'Finished'
      el.target.classList.remove('book__read-status--reading');
      el.target.classList.add('book__read-status--finished');
    } else {
      el.target.innerText = 'Not Read';
      el.target.classList.remove('book__read-status--finished');
      el.target.classList.add('book__read-status--not-read');
    };

    Store.toggleReadStatus(el.target);

  }

  static filterBooks(e) {
    // Get library
    myLibrary = Store.getBooks();
    const currentBooks = Array.from(bookContainer.children)

    const listItems = document.querySelectorAll('.side-nav__status');

    if (e.target.innerText === 'All') {
      currentBooks.forEach(book => book.style.display = 'flex');
    }

    // adding css class to clicked list item
    if (!e.target.classList.contains('active')) {
      listItems.forEach(li => li.classList.contains('active') ? li.classList.remove('active') : "")
      e.target.classList.add('active');
    }

    if (e.target.innerText === 'Not Read') {
      currentBooks.map(book => book.children[3].innerText !== 'Not Read' ? book.style.display = 'none' : book.style.display = 'flex');
    } else if (e.target.innerText === 'Currently Reading') {
      currentBooks.map(book => book.children[3].innerText !== 'Reading' ? book.style.display = 'none' : book.style.display = 'flex');
    } else if (e.target.innerText === 'Finished') {
      currentBooks.map(book => book.children[3].innerText !== 'Finished' ? book.style.display = 'none' : book.style.display = 'flex');
    }

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
    myLibrary.push(book);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary))
  }

  static removeBook(el) {
    myLibrary = Store.getBooks();
    myLibrary = myLibrary.filter(book => el.parentElement.children[0].innerText !== book.title)
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

// Filter list by read status
filterList.addEventListener('click', UI.filterBooks)

// DOM Load Event 
document.addEventListener('DOMContentLoaded', UI.displayBooks)