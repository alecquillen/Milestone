const API_KEY = 'AIzaSyBMtgM5pmAm79-KkyDbpVo_Jq-dKCTKN0I';
const RESULTS_PER_PAGE = 10;
const MAX_PAGES = 5; // Limit the pagination to 5 pages

// Home/Book Search Page
function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${API_KEY}&maxResults=${RESULTS_PER_PAGE}`;

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displaySearchResults(data);
            setupPagination(data.totalItems, searchTerm);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
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
    const totalPages = Math.min(Math.ceil(totalItems / RESULTS_PER_PAGE), MAX_PAGES); // Limit to 5 pages

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

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            displaySearchResults(data);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}

// My Bookshelf Page
function loadBookshelf() {
    const bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
    displayBookshelf(bookshelf);
}

function displayBookshelf(books) {
    const bookshelfContainer = document.getElementById('bookshelf-container');
    bookshelfContainer.innerHTML = '';

    if (books.length > 0) {
        books.forEach(book => {
            const bookHtml = `
                <div class="book">
                    <h4><a href="book-details.html?id=${book.id}" class="book-link">${book.title}</a></h4>
                    <p>By: ${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
                    <img src="${book.thumbnail}" alt="Book Cover">
                    <button onclick="removeFromBookshelf('${book.id}')">Remove from Bookshelf</button>
                </div>
            `;
            bookshelfContainer.innerHTML += bookHtml;
        });
    } else {
        bookshelfContainer.innerHTML = '<p>Bookshelf is empty...</p>';
    }
}

function addToBookshelf(bookId) {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const volumeInfo = data.volumeInfo;
            const book = {
                id: bookId,
                title: volumeInfo.title,
                authors: volumeInfo.authors,
                thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''
            };

            let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
            if (!bookshelf.find(b => b.id === bookId)) {
                bookshelf.push(book);
                localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
                alert('Book added to bookshelf');
            } else {
                alert('Book is already in the bookshelf');
            }
        },
        error: function(error) {
            console.error('Error adding book to bookshelf:', error);
        }
    });
}

function removeFromBookshelf(bookId) {
    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
    bookshelf = bookshelf.filter(book => book.id !== bookId);
    localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
    loadBookshelf();
}

// Load functions based on the current page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html')) {
        document.getElementById('searchButton').onclick = searchBooks;
    } else if (window.location.pathname.includes('bookshelf.html')) {
        loadBookshelf();
    } else if (window.location.pathname.includes('book-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');
        if (bookId) {
            fetchBookDetails(bookId);
        }
    }
});

function fetchBookDetails(bookId) {
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            const volumeInfo = data.volumeInfo;
            const bookDetailsHtml = `
                <h3>${volumeInfo.title}</h3>
                <p>By: ${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
                <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''}" alt="Book Cover">
                <p>${volumeInfo.description}</p>
            `;
            document.getElementById('bookDetails').innerHTML = bookDetailsHtml;
        },
        error: function(error) {
            console.error('Error fetching book details:', error);
        }
    });
}

