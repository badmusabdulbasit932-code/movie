import React, { useEffect, useState } from "react";
import Movie from "./Components/Movie";

const API_KEY = "082d7edebad5889af817afdc3faceee4";
const BASE_URL = "https://api.themoviedb.org/3";

const FEATURED_API = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const SEARCH_API = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchMovies(FEATURED_API);
  }, []);

  const fetchMovies = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      setMovies(data.results || []);
      setNotFound(data.results.length === 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      fetchMovies(FEATURED_API);
      setNotFound(false);
      return;
    }

    fetchMovies(SEARCH_API + searchTerm);
    setSearchTerm("");
  };

  return (
    <div className="root">
      <header>
        <h1>Pure Mind </h1>
        <form onSubmit={handleSearch}>
          <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </header>

      <div className="movie-container">
        {notFound ? (
          <h2 className="not-found">Movie not found </h2>
        ) : (
          movies.map((movie) => (
            <Movie key={movie.id} {...movie} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
