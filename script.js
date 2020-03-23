const container = document.querySelector('.container');
const bookContainer = document.querySelector('.book-container');
const newBookBtn = document.getElementById('new-book');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const form = document.getElementById('form');
let removeBookBtn;

let myLibrary;

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

  static displayBooks() {
    bookContainer.innerHTML = '';
    myLibrary = Store.getBooks();
    myLibrary.forEach((book) => {
      bookContainer.appendChild(book.bookElement)
      removeBookBtn = document.querySelectorAll('.remove-book-btn')
      removeBookBtn.forEach(btn => btn.addEventListener('click', removeBook))
    });
  }

  static addBook(book) {
    myLibrary = Store.getBooks();
    book = new Book(book.title, book.author, book.numOfPages, book.readStatus);
    myLibrary.push(book);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary))
  }

  // static removeBook(e) {
  //   e.target.parentElement.remove()
  //   myLibrary = Store.getBooks();
  //   console.log
  //   myLibrary = myLibrary.filter(book => !e.target.parentElement.innerHTML.includes(book.title))
  //   localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  //   Store.displayBooks();
  // }

  // static toggleReadStatusLocalStorage(e, readStatus) {
  //   myLibrary = Store.getBooks();
  //   console.log(e.target.parentElement);
  //   for (let i = 0; i < myLibrary.length; i++) {

  //     myLibrary[i].haveRead = readStatus;
  //     console.log(e.target);
  //     console.log(readStatus);
  //     localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  //     Store.displayBooks();

  //   }
  // }

}

// Utilities
function createBookElement() {
  const bookElement = document.createElement('ul');
  bookElement.classList.add('book');
  return bookElement;
};

// Book Class.
function Book(title, author, numOfPages, haveRead = 'Not Read') {
  this.title = title;
  this.author = author;
  this.numOfPages = numOfPages;
  this.haveRead = haveRead;
  this.bookElement = createBookElement();
  this.renderBookContents();
}

Book.prototype.renderBookContents = function () {
  this.bookElement.innerHTML = `
    <li>${this.title}</li>
    <li>${this.author}</li>
    <li>${this.numOfPages}</li>
    <li data-readstatus>${this.haveRead}</li>
    <button class="remove-book-btn">X</button>
  `;
  this.addListeners();
}

Book.prototype.toggleReadStatus = function (e) {
  this.haveRead = this.haveRead === 'Read' ? 'Not Read' : 'Read';
  this.renderBookContents();
  // Store.toggleReadStatusLocalStorage(e, this.haveRead)'
  myLibrary = Store.getBooks();

  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].haveRead !== this.haveRead && myLibrary[i].title === this.title) {
      myLibrary[i].haveRead = this.haveRead;
      localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
      Store.displayBooks();
    }
  }
}

Book.prototype.addListeners = function () {
  this.bookElement.querySelector('[data-readstatus]').addEventListener('click', this.toggleReadStatus.bind(this));
}

function addBookToLibrary(book) {
  Store.addBook(book);
  Store.displayBooks();
}

function addNewBookToLibrary(e) {
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
    } else {
      continue;
    }
  }

  addBookToLibrary(newBook);

  modal.classList.remove('show')
}

function removeBook(e) {
  e.target.parentElement.remove()
  myLibrary = Store.getBooks();
  console.log
  myLibrary = myLibrary.filter(book => !e.target.parentElement.innerHTML.includes(book.title))
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  Store.displayBooks();
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
form.addEventListener('submit', addNewBookToLibrary)

// DOM Load Event 
document.addEventListener('DOMContentLoaded', Store.displayBooks)


/* LIBRARY FOR TESTING

// // Library
// const theHobbit = new Book('The Hobbit', 'J.R.R Tolkien', 295, 'Not Read');
// const harryPotter3 = new Book('Harry Potter and the Prisoner of Azkaban', 'J. K. Rowling', 317, 'Read');
// const whenNietzscheWept = new Book('When Nietzsche Wept', 'Irvin D. Yalom', 303, 'Read');
// const nineteenEightyFour = new Book('1984', 'George Orwell', 325, 'Not Read');

// addBookToLibrary(theHobbit);
// addBookToLibrary(harryPotter3);
// addBookToLibrary(whenNietzscheWept);
// addBookToLibrary(nineteenEightyFour);

*/