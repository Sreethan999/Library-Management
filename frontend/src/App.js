import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  // ==========================================
  // API URLS
  // ==========================================

  const BOOK_API = "http://127.0.0.1:8000/api/books/";
  const USER_API = "http://127.0.0.1:8000/api/users/";

  // ==========================================
  // BOOK STATES
  // ==========================================

  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  // ==========================================
  // USER STATES
  // ==========================================

  const [users, setUsers] = useState([]);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const [editingUserId, setEditingUserId] = useState(null);

  // ==========================================
  // BORROW STATES
  // ==========================================

  const [selectedUsers, setSelectedUsers] = useState({});

  // ==========================================
  // FETCH BOOKS
  // ==========================================

  const fetchBooks = () => {

    axios
      .get(`${BOOK_API}?search=${search}`)
      .then((response) => {

        setBooks(response.data);

      })
      .catch((error) => {

        console.error("Error Fetching Books:", error);

      });

  };

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = () => {

    axios
      .get(USER_API)
      .then((response) => {

        setUsers(response.data);

      })
      .catch((error) => {

        console.error("Error Fetching Users:", error);

      });

  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {

    fetchBooks();
    fetchUsers();

  }, [search]);

  // ==========================================
  // ADD BOOK
  // ==========================================

  const addBook = () => {

    if (!title || !author || !isbn || !category) {

      alert("Please fill all book fields.");
      return;

    }

    axios
      .post(BOOK_API, {
        title,
        author,
        isbn,
        category,
        available,
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

        if (error.response?.data?.error) {

          alert(error.response.data.error);

        } else {

          alert("Unable to add book.");

        }

      });

  };

  // ==========================================
  // EDIT BOOK
  // ==========================================

  const editBook = (book) => {

    setEditingId(book.id);

    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setCategory(book.category);
    setAvailable(book.available);

  };

  // ==========================================
  // UPDATE BOOK
  // ==========================================

  const updateBook = () => {

    if (!title || !author || !isbn || !category) {

      alert("Please fill all book fields.");
      return;

    }

    axios
      .put(`${BOOK_API}${editingId}/`, {
        title,
        author,
        isbn,
        category,
        available,
      })

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

        if (error.response?.data?.error) {

          alert(error.response.data.error);

        } else {

          alert("Unable to update book.");

        }

      });

  };

  // ==========================================
  // CANCEL BOOK EDIT
  // ==========================================

  const cancelEdit = () => {

    setEditingId(null);

    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategory("");
    setAvailable(true);

  };

  // ==========================================
  // DELETE BOOK
  // ==========================================

  const deleteBook = (id) => {

    if (!window.confirm("Delete this book?")) {

      return;

    }

    axios
      .delete(`${BOOK_API}${id}/delete/`)
      .then(() => {

        fetchBooks();

      })
      .catch((error) => {

        console.error("Error Deleting Book:", error);

      });

  };

  // ==========================================
  // ADD USER
  // ==========================================

  const addUser = () => {

    if (!userName || !userEmail || !userPhone) {

      alert("Please fill all user fields.");
      return;

    }

    axios
      .post(USER_API, {
        name: userName,
        email: userEmail,
        phone: userPhone,
      })

      .then(() => {

        setUserName("");
        setUserEmail("");
        setUserPhone("");

        fetchUsers();

      })

      .catch((error) => {

        if (error.response?.data) {

          alert(JSON.stringify(error.response.data));

        } else {

          alert("Unable to add user.");

        }

      });

  };

  // ==========================================
  // EDIT USER
  // ==========================================

  const editUser = (user) => {

    setEditingUserId(user.id);

    setUserName(user.name);
    setUserEmail(user.email);
    setUserPhone(user.phone);

  };

  // ==========================================
  // UPDATE USER
  // ==========================================

  const updateUser = () => {

    if (!userName || !userEmail || !userPhone) {

      alert("Please fill all user fields.");
      return;

    }

    axios
      .put(`${USER_API}${editingUserId}/`, {
        name: userName,
        email: userEmail,
        phone: userPhone,
      })

      .then(() => {

        setEditingUserId(null);

        setUserName("");
        setUserEmail("");
        setUserPhone("");

        fetchUsers();

      })

      .catch((error) => {

        if (error.response?.data) {

          alert(JSON.stringify(error.response.data));

        } else {

          alert("Unable to update user.");

        }

      });

  };

  // ==========================================
  // CANCEL USER EDIT
  // ==========================================

  const cancelUserEdit = () => {

    setEditingUserId(null);

    setUserName("");
    setUserEmail("");
    setUserPhone("");

  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const deleteUser = (id) => {

    if (!window.confirm("Delete this user?")) {

      return;

    }

    axios
      .delete(`${USER_API}${id}/delete/`)
      .then(() => {

        fetchUsers();

      })
      .catch((error) => {

        console.error("Error Deleting User:", error);

      });

  };

  // ==========================================
  // HANDLE USER SELECTION
  // ==========================================

  const handleUserSelect = (bookId, userId) => {

    setSelectedUsers((prev) => ({
      ...prev,
      [bookId]: userId,
    }));

  };

  // ==========================================
  // BORROW BOOK
  // ==========================================

  const borrowBook = (bookId) => {

    const userId = selectedUsers[bookId];

    if (!userId) {

      alert("Please select a user.");
      return;

    }

    const formData = new FormData();
    formData.append("user_id", userId);

    axios
      .post(
        `http://127.0.0.1:8000/api/books/${bookId}/borrow/`,
        formData
      )

      .then(() => {

        fetchBooks();

        setSelectedUsers((prev) => ({
          ...prev,
          [bookId]: "",
        }));

      })

      .catch((error) => {

        if (error.response?.data) {

          alert(JSON.stringify(error.response.data));

        } else {

          alert("Unable to borrow book.");

        }

      });

  };

  // ==========================================
  // RETURN BOOK
  // ==========================================

  const returnBook = (bookId) => {

    axios
      .post(
        `http://127.0.0.1:8000/api/books/${bookId}/return/`
      )

      .then(() => {

        fetchBooks();

      })

      .catch((error) => {

        if (error.response?.data) {

          alert(JSON.stringify(error.response.data));

        } else {

          alert("Unable to return book.");

        }

      });

  };

  return (

        <div className="container mt-5">

      <h1 className="text-center mb-4">
        📚 Library Management System
      </h1>

      {/* ==========================
          BOOK FORM
      ========================== */}

      <div className="card shadow p-4 mb-4">

        <h4 className="mb-3">
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

        <select
          className="form-select mb-3"
          value={available ? "true" : "false"}
          onChange={(e) => setAvailable(e.target.value === "true")}
        >
          <option value="true">Available</option>
          <option value="false">Borrowed</option>
        </select>

        {editingId ? (
          <>
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
          </>
        ) : (
          <button
            className="btn btn-success"
            onClick={addBook}
          >
            Add Book
          </button>
        )}

      </div>

      {/* ==========================
          SEARCH
      ========================== */}

      <input
        className="form-control mb-4"
        placeholder="Search Books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ==========================
          BOOK TABLE
      ========================== */}

      <table className="table table-bordered table-striped shadow">

        <thead className="table-dark">

          <tr>

            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Borrower</th>
            <th>Status</th>
            <th>Borrow / Return</th>
            <th width="200">Actions</th>

          </tr>

        </thead>

        <tbody>

          {books.length > 0 ? (

            books.map((book, index) => (

              <tr key={book.id}>

                <td>{index + 1}</td>

                <td>{book.title}</td>

                <td>{book.author}</td>

                <td>{book.isbn}</td>

                <td>{book.category}</td>

                <td>{book.borrowed_by_name || "-"}</td>

                <td>

                  {book.available ? (

                    <span className="badge bg-success">
                      Available
                    </span>

                  ) : (

                    <span className="badge bg-danger">
                      Borrowed
                    </span>

                  )}

                </td>

                <td>

                  {book.available ? (

                    <>
                      <select
                        className="form-select form-select-sm mb-2"
                        value={selectedUsers[book.id] || ""}
                        onChange={(e) =>
                          handleUserSelect(book.id, e.target.value)
                        }
                      >

                        <option value="">
                          Select User
                        </option>

                        {users.map((user) => (

                          <option
                            key={user.id}
                            value={user.id}
                          >
                            {user.name}
                          </option>

                        ))}

                      </select>

                      <button
                        className="btn btn-warning btn-sm w-100"
                        onClick={() => borrowBook(book.id)}
                      >
                        Borrow
                      </button>

                    </>

                  ) : (

                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => returnBook(book.id)}
                    >
                      Return
                    </button>

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

              <td
                colSpan="8"
                className="text-center"
              >
                No Books Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

            {/* ==========================
          USER SECTION
      ========================== */}

      <div className="card shadow p-4 mt-5">

        <h4 className="mb-4">
          {editingUserId ? "Edit User" : "Add User"}
        </h4>

        <input
          className="form-control mb-3"
          placeholder="Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Phone"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />

        {editingUserId ? (

          <>
            <button
              className="btn btn-warning me-2"
              onClick={updateUser}
            >
              Update User
            </button>

            <button
              className="btn btn-secondary"
              onClick={cancelUserEdit}
            >
              Cancel
            </button>
          </>

        ) : (

          <button
            className="btn btn-success"
            onClick={addUser}
          >
            Add User
          </button>

        )}

      </div>

      {/* ==========================
          USER TABLE
      ========================== */}

      <table className="table table-bordered table-striped shadow mt-4">

        <thead className="table-dark">

          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th width="180">Actions</th>
          </tr>

        </thead>

        <tbody>

          {users.length > 0 ? (

            users.map((user, index) => (

              <tr key={user.id}>

                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>

                <td>

                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => editUser(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="5"
                className="text-center"
              >
                No Users Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

export default App;