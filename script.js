const googleBooksSearch = {
    "kind": "books#volumes",
    "totalItems": 2000,
    "items": [
        // ... (the full array of items from the google-books-search.json)
    ]
};

const googleBooksBook = {
    "kind": "books#volume",
    "id": "Wfan6L9RGgYC",
    "volumeInfo": {
        "title": "The Modern Web",
        "subtitle": "Multi-device Web Development with HTML5, CSS3, and JavaScript",
        "authors": ["Peter Gasston"],
        "publisher": "No Starch Press",
        "publishedDate": "2013",
        "description": "A Guide to Modern Web Development...",
        "pageCount": 264,
        "averageRating": 5,
        "ratingsCount": 2,
        "imageLinks": {
            "thumbnail": "http://books.google.com/books/content?id=Wfan6L9RGgYC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72Xp-i5p2FmZQaKlZRbFLOy9K0h1gMjYDhszxPUSua9ZWMdsVIucc_fWOSbv7Nt2WbiUFTdsGh3SaZttrp7i7jxl5yqAiY1hJoVK48oYKYhnxwCmLqdPvGVSn9CMB7XUisAA_W-&source=gbs_api"
        }
    }
};

function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const results = googleBooksSearch.items.filter(book => 
        book.volumeInfo.title.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';
    results.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.innerHTML = `
            <h4>${book.volumeInfo.title}</h4>
            <p>By: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
            <img src="${book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : ''}" alt="Book cover">
            <button onclick="displayBookDetails('${book.id}')">View Details</button>
        `;
        resultsDiv.appendChild(bookDiv);
    });
}

function displayBookDetails(bookId) {
    // In a real application, you would fetch the book details using the bookId
    // For this example, we'll use the sample googleBooksBook data
    const book = googleBooksBook;
    const detailsDiv = document.getElementById('bookDetails');
    detailsDiv.innerHTML = `
        <h3>${book.volumeInfo.title}</h3>
        <h4>${book.volumeInfo.subtitle}</h4>
        <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="Book cover">
        <p>By: ${book.volumeInfo.authors.join(', ')}</p>
        <p>Publisher: ${book.volumeInfo.publisher}</p>
        <p>Published Date: ${book.volumeInfo.publishedDate}</p>
        <p>Page Count: ${book.volumeInfo.pageCount}</p>
        <p>Rating: ${book.volumeInfo.averageRating} (${book.volumeInfo.ratingsCount} ratings)</p>
        <p>${book.volumeInfo.description}</p>
    `;
}