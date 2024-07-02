// books.js - Updated Functions

const API_KEY = 'your_api_key_here'; // Replace with your actual API key
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

// My Bookshelf Page
function loadBookshelf() {
    const bookshelfId = 'your_bookshelf_id_here'; // Replace with your actual bookshelf ID
    const url = `https://www.googleapis.com/books/v1/users/YOUR_USER_ID/bookshelves/${bookshelfId}/volumes?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayBookshelf(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayBookshelf(data) {
    const bookshelfContainer = document.getElementById('bookshelf-container');
    bookshelfContainer.innerHTML = '';

    if (data.items) {
        data.items.forEach(book => {
            const volumeInfo = book.volumeInfo;
            const bookHtml = `
                <div class="book">
                    <h4><a href="book-details.html?id=${book.id}" class="book-link">${volumeInfo.title}</a></h4>
                    <p>By: ${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
                    <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''}" alt="Book Cover">
                </div>
            `;
            bookshelfContainer.innerHTML += bookHtml;
        });
    }
}

// Load functions based on the current page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html')) {
        document.getElementById('search-button').onclick = searchBooks;
    } else if (window.location.pathname.includes('bookshelf.html')) {
        loadBookshelf();
    }
});
