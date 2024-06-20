$(document).ready(function () {
    // Fetch and display the details of a single book
    $.getJSON('google-books-book.json', function (data) {
        let bookDetailsContainer = $('#book-details-container');
        let volumeInfo = data.volumeInfo;
        
        let bookHtml = `
            <div class="book">
                <h2>${volumeInfo.title}</h2>
                <h3>${volumeInfo.subtitle}</h3>
                <p><strong>Author:</strong> ${volumeInfo.authors.join(', ')}</p>
                <p><strong>Publisher:</strong> ${volumeInfo.publisher}</p>
                <p><strong>Published Date:</strong> ${volumeInfo.publishedDate}</p>
                <p><strong>Description:</strong> ${volumeInfo.description}</p>
                <img src="${volumeInfo.imageLinks.thumbnail}" alt="Book Cover">
            </div>
        `;
        
        bookDetailsContainer.html(bookHtml);
    });

    // Fetch and display the list of books
    $.getJSON('google-books-search.json', function (data) {
        let bookListContainer = $('#book-list-container');
        let books = data.items;
        
        let booksHtml = books.map(book => {
            let volumeInfo = book.volumeInfo;
            return `
                <div class="book">
                    <h2>${volumeInfo.title}</h2>
                    <p><strong>Author:</strong> ${volumeInfo.authors.join(', ')}</p>
                    <p><strong>Publisher:</strong> ${volumeInfo.publisher}</p>
                    <p><strong>Published Date:</strong> ${volumeInfo.publishedDate}</p>
                    <p><strong>Description:</strong> ${volumeInfo.description}</p>
                    <img src="${volumeInfo.imageLinks.thumbnail}" alt="Book Cover">
                </div>
            `;
        }).join('');
        
        bookListContainer.html(booksHtml);
    });
});

