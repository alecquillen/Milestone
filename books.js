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

// My Bookshelf Page
function loadBookshelf() {
    const bookshelfId = '1001';
    const url = `https://www.googleapis.com/books/v1/users/117522004192189783614/bookshelves/${bookshelfId}/volumes?key=${API_KEY}`;

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
    } else if (window.location.pathname.includes('book-details.html')) {
        loadBookDetails();
    } else if (window.location.pathname.includes('bookshelf.html')) {
        loadBookshelf();
    }
});
