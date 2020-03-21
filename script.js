const container = document.querySelector('.container');
const bookContainer = document.querySelector('.book-container');
const newBookBtn = document.getElementById('new-book');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const form = document.getElementById('form');
let removeBookBtn;

const localStorageLibrary = JSON.parse(localStorage.getItem('myLibrary'));

let myLibrary = localStorage.getItem('myLibrary') !== null ? localStorageLibrary : [];

function updateLocalStorage() {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Utilities
function createBookElement() {
  const bookEl = document.createElement('ul');
  bookEl.classList.add('book');
  return bookEl;
}

// Book Class.
function Book(title, author, numOfPages, haveRead) {
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

Book.prototype.toggleReadStatus = function () {
  this.haveRead = this.haveRead === 'Read' ? 'Not Read' : 'Read';
  this.renderBookContents();
}

Book.prototype.addListeners = function () {
  this.bookElement.querySelector('[data-readstatus]').addEventListener('click', this.toggleReadStatus.bind(this));
}


// // Library
// const theHobbit = new Book('The Hobbit', 'J.R.R Tolkien', 295, 'Not Read');
// const harryPotter3 = new Book('Harry Potter and the Prisoner of Azkaban', 'J. K. Rowling', 317, 'Read');
// const whenNietzscheWept = new Book('When Nietzsche Wept', 'Irvin D. Yalom', 303, 'Read');
// const nineteenEightyFour = new Book('1984', 'George Orwell', 325, 'Not Read');

// addBookToLibrary(theHobbit);
// addBookToLibrary(harryPotter3);
// addBookToLibrary(whenNietzscheWept);
// addBookToLibrary(nineteenEightyFour);

function addBookToLibrary(book) {
  myLibrary.push(book);
  updateLocalStorage()
  updateDOM()
}

function updateDOM() {
  bookContainer.innerHTML = '';

  myLibrary.forEach((book) => {
    bookContainer.appendChild(book.bookElement)
  });


  removeBookBtn = document.querySelectorAll('.remove-book-btn')

  // Remove book
  removeBookBtn.forEach(btn => btn.addEventListener('click', removeBook))

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

  if (newBook.haveRead === null) {
    newBook.haveRead = 'Not Read';
  }

  addBookToLibrary(newBook);
  modal.classList.remove('show')

}

// Remove Books 
function removeBook(e) {
  e.target.parentElement.remove()
  myLibrary = myLibrary.filter(book => !e.target.parentElement.innerHTML.includes(book.title))
  updateLocalStorage()
  updateDOM()
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


