$(document).ready(function () {
    const API_KEY = 'YOUR_GOOGLE_BOOKS_API_KEY';
    const RESULTS_PER_PAGE = 10;

    // Home/Book Search Page
    if (window.location.pathname.includes('index.html')) {
        $('#search-button').click(function () {
            const searchTerm = $('#searchInput').val();
            const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${API_KEY}&maxResults=${RESULTS_PER_PAGE}`;
    
            $.getJSON(url, function (data) {
                displaySearchResults(data);
            });
        });
    
        function displaySearchResults(data) {
            let searchResultsContainer = $('#searchResults');
            searchResultsContainer.empty();
    
            if (data.items) {
                data.items.forEach(book => {
                    let volumeInfo = book.volumeInfo;
                    let bookHtml = `
                        <div class="book">
                            <h4><a href="book-details.html?id=${book.id}" class="book-link">${volumeInfo.title}</a></h4>
                            <p>By: ${volumeInfo.authors.join(', ')}</p>
                            <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''}" alt="Book Cover">
                        </div>
                    `;
                    searchResultsContainer.append(bookHtml);
                });
            }
        }
    }

    // Book Details Page
    if (window.location.pathname.includes('book-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');
        if (bookId) {
            fetchBookDetails(bookId);
        }
    }

    function fetchBookDetails(bookId) {
        const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;

        $.getJSON(url, function (data) {
            displayBookDetails(data);
        });
    }

    function displayBookDetails(data) {
        let bookDetailsContainer = $('#bookDetails');
        bookDetailsContainer.empty();

        let volumeInfo = data.volumeInfo;
        let bookHtml = `
            <div class="book">
                <h2>${volumeInfo.title}</h2>
                <h3>${volumeInfo.subtitle}</h3>
                <p><strong>Author:</strong> ${volumeInfo.authors.join(', ')}</p>
                <p><strong>Publisher:</strong> ${volumeInfo.publisher}</p>
                <p><strong>Published Date:</strong> ${volumeInfo.publishedDate}</p>
                <p><strong>Description:</strong> ${volumeInfo.description}</p>
                <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''}" alt="Book Cover">
            </div>
        `;
        
        bookDetailsContainer.html(bookHtml);
    }

    // My Bookshelf Page
    if (window.location.pathname.includes('bookshelf.html')) {
        fetchBookshelf();
    }

    function fetchBookshelf() {
        const bookshelfId = 'YOUR_PUBLIC_BOOKSHELF_ID';
        const url = `https://www.googleapis.com/books/v1/users/YOUR_USER_ID/bookshelves/${bookshelfId}/volumes?key=${API_KEY}`;

        $.getJSON(url, function (data) {
            displayBookshelf(data);
        });
    }

    function displayBookshelf(data) {
        let bookshelfContainer = $('#bookshelf-container');
        bookshelfContainer.empty();

        if (data.items) {
            data.items.forEach(book => {
                let volumeInfo = book.volumeInfo;
                let bookHtml = `
                    <div class="book">
                        <h4><a href="book-details.html?id=${book.id}" class="book-link">${volumeInfo.title}</a></h4>
                        <p>By: ${volumeInfo.authors.join(', ')}</p>
                        <img src="${volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : ''}" alt="Book Cover">
                    </div>
                `;
                bookshelfContainer.append(bookHtml);
            });
        }
    }
});
