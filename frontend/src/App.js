import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  // ===========================
  // STATES
  // ===========================

  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  // ===========================
  // FETCH BOOKS
  // ===========================

  const fetchBooks = () => {

    axios
      .get(`http://127.0.0.1:8000/api/books/?search=${search}`)
      .then((response) => {

        setBooks(response.data);

      })
      .catch((error) => {

        console.error("Error Fetching Books:", error);

      });

  };

  useEffect(() => {

    fetchBooks();

  }, [search]);

  // ===========================
  // ADD BOOK
  // ===========================

  const addBook = () => {

    if (!title || !author || !isbn || !category) {

      alert("Please fill all fields.");
      return;

    }

    axios
      .post("http://127.0.0.1:8000/api/books/", {

        title,
        author,
        isbn,
        category,
        available

      })

      .then(() => {

        setTitle("");
        setAuthor("");
        setIsbn("");
        setCategory("");
        setAvailable(true);

        fetchBooks();

      })

      .catch((error) => {

        if (error.response && error.response.data.error) {

          alert(error.response.data.error);

        } else {

          alert("Something went wrong.");

        }

      });
  };

    // ===========================
  // DELETE BOOK
  // ===========================

  const deleteBook = (id) => {

    if (!window.confirm("Delete this book?")) {
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/api/books/${id}/`)
      .then(() => {

        fetchBooks();

      })
      .catch((error) => {

        console.error("Error Deleting Book:", error);

      });

  };

  // ===========================
  // EDIT BOOK
  // ===========================

  const editBook = (book) => {

    setEditingId(book.id);

    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setCategory(book.category);
    setAvailable(book.available);

  };

  // ===========================
  // UPDATE BOOK
  // ===========================

  const updateBook = () => {

    if (!title || !author || !isbn || !category) {

      alert("Please fill all fields.");
      return;

    }

    axios
      .put(
        `http://127.0.0.1:8000/api/books/update/${editingId}/`,
        {
          title,
          author,
          isbn,
          category,
          available,
        }
      )

      .then(() => {

        setEditingId(null);

        setTitle("");
        setAuthor("");
        setIsbn("");
        setCategory("");
        setAvailable(true);

        fetchBooks();

      })

      .catch((error) => {

        if (error.response && error.response.data.error) {

          alert(error.response.data.error);

        } else {

          alert("Something went wrong.");

        }

      });

  };

  // ===========================
  // CANCEL EDIT
  // ===========================

  const cancelEdit = () => {

    setEditingId(null);

    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategory("");
    setAvailable(true);

  };

  // ===========================
  // UI
  // ===========================

  return (

    <div className="container mt-5">

      <h1 className="text-center mb-4">
        Library Management
      </h1>

      <div className="card shadow p-4 mb-4">

        <h4 className="mb-4">
          {editingId ? "Edit Book" : "Add Book"}
        </h4>

                <input
          className="form-control mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className="mb-3">
          <label className="form-label">Available</label>

          <select
            className="form-select"
            value={available ? "true" : "false"}
            onChange={(e) => setAvailable(e.target.value === "true")}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {editingId ? (
          <div>
            <button
              className="btn btn-warning me-2"
              onClick={updateBook}
            >
              Update Book
            </button>

            <button
              className="btn btn-secondary"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn btn-success"
            onClick={addBook}
          >
            Add Book
          </button>
        )}

      </div>

      <input
        className="form-control mb-4"
        placeholder="Search by Title, Author, ISBN or Category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-bordered table-striped shadow">

        <thead className="table-dark">

          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Available</th>
            <th width="180">Action</th>
          </tr>

        </thead>

        <tbody>

                    {books.length > 0 ? (

            books.map((book) => (

              <tr key={book.id}>

                <td>{book.title}</td>

                <td>{book.author}</td>

                <td>{book.isbn}</td>

                <td>{book.category}</td>

                <td>
                  {book.available ? (
                    <span className="badge bg-success">
                      Yes
                    </span>
                  ) : (
                    <span className="badge bg-danger">
                      No
                    </span>
                  )}
                </td>

                <td>

                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => editBook(book)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td colSpan="6" className="text-center">
                No Books Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

export default App;

