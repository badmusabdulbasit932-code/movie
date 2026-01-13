import React, { useEffect, useState } from "react";

const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/";
const API_KEY = "082d7edebad5889af817afdc3faceee4";
const BASE_URL = "https://api.themoviedb.org/3";

function Movie({ id, title, poster_path, overview, vote_average, release_date }) {
  const [showModal, setShowModal] = useState(false);
  const [actors, setActors] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);

  const [tagline, setTagline] = useState("");
  const [genres, setGenres] = useState([]);
  const [runtime, setRuntime] = useState(null);

  const [trailerKey, setTrailerKey] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const getClassByRate = (vote) => {
    if (vote >= 8) return "green";
    if (vote >= 5) return "orange";
    return "red";
  };

  const openModal = () => {
    document.body.classList.add("modal-open");
    setShowModal(true);
  };

  const closeModal = () => {
    document.body.classList.remove("modal-open");
    setShowModal(false);
    setShowTrailer(false);
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showModal]);

  useEffect(() => {
    if (!showModal) return;

    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setTagline(data.tagline || "");
        setGenres(data.genres || []);
        setRuntime(data.runtime || null);
      })
      .catch(() => {
        setTagline("");
        setGenres([]);
        setRuntime(null);
      });

    
    fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : "");
      })
      .catch(() => setTrailerKey(""));

    fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setActors(data.cast ? data.cast.slice(0, 10) : []);
      })
      .catch(() => setActors([]));

    fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setRelatedMovies(data.results ? data.results.slice(0, 8) : []);
      })
      .catch(() => setRelatedMovies([]));
  }, [showModal, id]);

  return (
    <>
      <div className="movie">
        <div className="movie-img">
          <img src={IMG_PATH + poster_path} alt={title} />
          <button className="view-btn" onClick={openModal}>
            View Details
          </button>
        </div>

        <div className="movie-info">
          <h3>{title}</h3>
          <span className={getClassByRate(vote_average)}>{vote_average}</span>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeModal}>
              ✖
            </button>
            <div
              className="movie-flex"
              style={{
                backgroundImage: `linear-gradient(rgba(10,10,20,0.9), rgba(10,10,20,0.95)), 
                url(${IMG_PATH + poster_path})`,
              }}
            >
              <div className="left">
                <img src={IMG_PATH + poster_path} alt={title} />
              </div>

              <div className="right">
                <h2>{title}</h2>
                {tagline && <p className="tagline">“{tagline}”</p>}

                <p>
                  <strong>Release Date:</strong> {release_date}
                </p>
                <p>
                  <strong>Rating:</strong> {vote_average}
                </p>

                {runtime && (
                  <p>
                    <strong>Runtime:</strong> {runtime} mins
                  </p>
                )}
                <div className="genres">
                  {genres.map((g) => (
                    <span key={g.id} className="genre">
                      {g.name}
                    </span>
                  ))}
                </div>
                {trailerKey && (
                  <button
                    className="trailer-btn"
                    onClick={() => setShowTrailer(true)}
                  >
                    ▶ Watch Trailer
                  </button>
                )}
              </div>
            </div>
            {showTrailer && (
              <div className="trailer">
                <button
                  className="close-trailer"
                  onClick={() => setShowTrailer(false)}
                >
                  ✖ Close Trailer
                </button>

                <iframe
                  src={`${YOUTUBE_EMBED_URL}${trailerKey}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )}
            <div className="overview-section">
              <h1>Overview</h1>
              <p className="modal-info">{overview}</p>
            </div>
            <div className="actors">
              <h3>Top Cast</h3>
              <div className="actors-grid">
                {actors.map((actor) => (
                  <div key={actor.id} className="actor-card">
                    {actor.profile_path ? (
                      <img
                        src={IMG_PATH + actor.profile_path}
                        alt={actor.name}
                      />
                    ) : (
                      <div
                        style={{
                          height: "140px",
                          background: "#555",
                          borderRadius: "6px",
                        }}
                      />
                    )}
                    <p className="actor-name">{actor.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="related-movies">
              <h3>Related Movies</h3>
              <div className="related-grid">
                {relatedMovies.map((movie) => (
                  <Movie key={movie.id} {...movie} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Movie;
