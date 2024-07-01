import { React, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BooksList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    const response = await axios.get("http://localhost:5000/books");
    setBooks(response.data);
  };

  const deleteBooks = async (booksId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete books?"
    );
    if (confirmDelete) {
      await axios.delete(`http://localhost:5000/books/${booksId}`);
    }
    getBooks();
  };

  return (
    <div>
      <h1 className="title has-text-dark">Books</h1>
      <h2 className="subtitle has-text-dark">List of Books</h2>
      <Link to={"/books/add"} className="button is-primary mb-2">
        Add Books
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Book Name</th>
            <th>Genre</th>
            <th>Deadline</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.uuid}>
              <td>{index + 1}</td>
              <td>{book.name}</td>
              <td>{book.genre}</td>
              <td>{book.deadline}</td>
              <td>{book.user.name}</td>
              <td>
                <Link
                  to={`/books/edit/${book.uuid}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteBooks(book.uuid)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BooksList;
