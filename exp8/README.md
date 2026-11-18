# Experiment 8 - Book Collection REST API

Simple RESTful API built with **Node.js** and **Express.js** to manage a book collection using CRUD operations.

## Run the project

```bash
cd exp8
npm install
npm start
```

Server starts at:

- Frontend UI: `http://localhost:3000`
- API info route: `http://localhost:3000/api`

## API Endpoints

### 1) Get all books

- **GET** `/api/books`
- Optional query params:
  - `search` -> searches in title and author
  - `genre` -> exact genre match

Example:

`GET /api/books?search=atomic`

### 2) Get one book by ID

- **GET** `/api/books/:id`

### 3) Add a new book

- **POST** `/api/books`
- Body (JSON):

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publishedYear": 2008,
  "genre": "Programming"
}
```

### 4) Update an existing book

- **PUT** `/api/books/:id`
- Body (JSON): same fields as POST

### 5) Delete a book

- **DELETE** `/api/books/:id`

## Notes

- Data is stored in memory (array), so it resets when server restarts.
- Includes basic validation and clean error messages.
- Frontend dashboard supports add, update, delete, search, and filter operations.
