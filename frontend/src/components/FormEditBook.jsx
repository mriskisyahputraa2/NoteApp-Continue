import { React, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditBook = () => {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [deadline, setDeadline] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getBookById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        setName(response.data.name);
        setGenre(response.data.genre);
        setDeadline(response.data.deadline);
      } catch (error) {
        if (error.message) {
          setMsg(error.message.data.msg);
        }
      }
    };
    getBookById();
  }, [id]);

  const updateBook = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/books/${id}`, {
        name: name,
        genre: genre,
        deadline: deadline,
      });
      navigate("/books");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title  has-text-dark">Books</h1>
      <h2 className="subtitle  has-text-dark">Edit Book</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateBook}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Book Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Book Name"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Genre</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Genre"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Deadline</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="Deadline"
                  />
                </div>
              </div>
              <div className="field mt-5">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-success is-fullwidth"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditBook;
