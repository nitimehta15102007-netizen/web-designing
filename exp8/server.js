const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let books = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    publishedYear: 2018,
    genre: 'Self Help',
    createdAt: '2026-11-01T09:00:00.000Z',
    updatedAt: '2026-11-01T09:00:00.000Z'
  },
  {
    id: 2,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    publishedYear: 1988,
    genre: 'Fiction',
    createdAt: '2026-11-01T09:10:00.000Z',
    updatedAt: '2026-11-01T09:10:00.000Z'
  }
];

let nextId = books.length + 1;

function parseBookId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateBookPayload(payload) {
  const title = normalizeString(payload.title);
  const author = normalizeString(payload.author);
  const genre = normalizeString(payload.genre) || 'General';
  const year = Number(payload.publishedYear);
  const errors = [];

  if (!title) {
    errors.push('title is required and must be a non-empty string.');
  }

  if (!author) {
    errors.push('author is required and must be a non-empty string.');
  }

  if (!Number.isInteger(year) || year < 1000 || year > 2100) {
    errors.push('publishedYear must be a valid 4-digit year between 1000 and 2100.');
  }

  if (genre.length > 30) {
    errors.push('genre must be 30 characters or fewer.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    bookData: {
      title,
      author,
      publishedYear: year,
      genre
    }
  };
}

app.get('/api', (req, res) => {
  res.json({
    message: 'Experiment 8 Book API is running.',
    endpoints: {
      listBooks: 'GET /api/books',
      getBookById: 'GET /api/books/:id',
      createBook: 'POST /api/books',
      updateBook: 'PUT /api/books/:id',
      deleteBook: 'DELETE /api/books/:id'
    }
  });
});

app.get('/api/books', (req, res) => {
  const search = normalizeString(req.query.search).toLowerCase();
  const genreQuery = normalizeString(req.query.genre).toLowerCase();

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search);

    const matchesGenre = !genreQuery || book.genre.toLowerCase() === genreQuery;

    return matchesSearch && matchesGenre;
  });

  res.status(200).json({
    total: filteredBooks.length,
    books: filteredBooks
  });
});

app.get('/api/books/:id', (req, res) => {
  const id = parseBookId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'Invalid book ID.' });
  }

  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  return res.status(200).json(book);
});

app.post('/api/books', (req, res) => {
  const validation = validateBookPayload(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Validation failed.',
      details: validation.errors
    });
  }

  const timestamp = new Date().toISOString();

  const newBook = {
    id: nextId,
    ...validation.bookData,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  nextId += 1;
  books.push(newBook);

  return res.status(201).json({
    message: 'Book added successfully.',
    book: newBook
  });
});

app.put('/api/books/:id', (req, res) => {
  const id = parseBookId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'Invalid book ID.' });
  }

  const bookIndex = books.findIndex((item) => item.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const validation = validateBookPayload(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Validation failed.',
      details: validation.errors
    });
  }

  const currentBook = books[bookIndex];
  const updatedBook = {
    ...currentBook,
    ...validation.bookData,
    updatedAt: new Date().toISOString()
  };

  books[bookIndex] = updatedBook;

  return res.status(200).json({
    message: 'Book updated successfully.',
    book: updatedBook
  });
});

app.delete('/api/books/:id', (req, res) => {
  const id = parseBookId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'Invalid book ID.' });
  }

  const bookIndex = books.findIndex((item) => item.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const removedBook = books[bookIndex];
  books = books.filter((item) => item.id !== id);

  return res.status(200).json({
    message: 'Book deleted successfully.',
    book: removedBook
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found. Please use /api/books endpoints.'
  });
});

app.listen(PORT, () => {
  console.log(`Book API server is running on http://localhost:${PORT}`);
});
