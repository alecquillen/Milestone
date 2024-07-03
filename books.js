// books.js - Updated Functions

const API_KEY = 'AIzaSyBMtgM5pmAm79-KkyDbpVo_Jq-dKCTKN0I'; 
const RESULTS_PER_PAGE = 10;

// Home/Book Search Page
function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${API_KEY}&maxResults=${RESULTS_PER_PAGE}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
            setupPagination(data.totalItems, searchTerm);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displaySearchResults(data) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';

    if (data.items) {
        data.items.forEach(book => {
            const volumeInfo = book.volumeInfo;
            const bookHtml = `
                <div class="book">
                    <h4><a href="book-details.html?id=${book.id}" class="book-link">${volumeInfo.title}</a></h4>
                    <p>By: ${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
                    <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''}" alt="Book Cover">
                    <button onclick="addToBookshelf('${book.id}')">Add to Bookshelf</button>
                </div>
            `;
            searchResultsContainer.innerHTML += bookHtml;
        });
    }
}

function setupPagination(totalItems, searchTerm) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / RESULTS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => fetchPage(i, searchTerm);
        paginationContainer.appendChild(button);
    }
}

function fetchPage(page, searchTerm) {
    const startIndex = (page - 1) * RESULTS_PER_PAGE;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${API_KEY}&startIndex=${startIndex}&maxResults=${RESULTS_PER_PAGE}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displaySearchResults(data))
        .catch(error => console.error('Error fetching data:', error));
}

// Function to add book to local storage bookshelf
function addToBookshelf(bookId) {
    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
    if (!bookshelf.includes(bookId)) {
        bookshelf.push(bookId);
        localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
        alert('Book added to your bookshelf!');
    } else {
        alert('Book is already in your bookshelf.');
    }
}

// My Bookshelf Page
function loadBookshelf() {
    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
    const bookshelfContainer = document.getElementById('bookshelf-container');
    bookshelfContainer.innerHTML = '';

    if (bookshelf.length === 0) {
        bookshelfContainer.innerHTML = '<p>Your bookshelf is empty.</p>';
        return;
    }

    bookshelf.forEach(bookId => {
        const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;

        fetch(url)
            .then(response => response.json())
            .then(data => displayBookshelfBook(data))
            .catch(error => console.error('Error fetching data:', error));
    });
}

function displayBookshelfBook(data) {
    const bookshelfContainer = document.getElementById('bookshelf-container');
    const volumeInfo = data.volumeInfo;
    const bookHtml = `
        <div class="book">
            <h4><a href="book-details.html?id=${data.id}" class="book-link">${volumeInfo.title}</a></h4>
            <p>By: ${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
            <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''}" alt="Book Cover">
        </div>
    `;
    bookshelfContainer.innerHTML += bookHtml;
}

// Book Details Page
function loadBookDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    if (bookId) {
        fetchBookDetails(bookId);
    }
}

function fetchBookDetails(bookId) {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayBookDetails(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayBookDetails(data) {
    const bookDetailsContainer = document.getElementById('bookDetails');
    bookDetailsContainer.innerHTML = '';

    const volumeInfo = data.volumeInfo;
    const bookHtml = `
        <div class="book">
            <h2>${volumeInfo.title}</h2>
            <h3>${volumeInfo.subtitle ? volumeInfo.subtitle : ''}</h3>
            <p><strong>Author:</strong> ${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
            <p><strong>Publisher:</strong> ${volumeInfo.publisher}</p>
            <p><strong>Published Date:</strong> ${volumeInfo.publishedDate}</p>
            <p><strong>Description:</strong> ${volumeInfo.description}</p>
            <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''}" alt="Book Cover">
        </div>
    `;
    bookDetailsContainer.innerHTML = bookHtml;
}

// Load functions based on the current page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('homepage.html')) {
        document.getElementById('searchButton').onclick = searchBooks;
    } else if (window.location.pathname.includes('bookshelf.html')) {
        loadBookshelf();
    } else if (window.location.pathname.includes('book-details.html')) {
        loadBookDetails();
    }
});
