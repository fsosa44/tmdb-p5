import { useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useState } from "react";
import YouTube from "react-youtube";

function App() {
  const keyApi = "ba93d47944dcdc9fbcc575b8943ef3e2";
  const urlApi = "https://api.themoviedb.org/3";
  const imagen = "https://image.tmdb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);
  const fetchMovies = (searchKey) => {
    const type = searchKey ? "search" : "discover";
    return axios
      .get(`${urlApi}/${type}/movie`, {
        params: {
          api_key: keyApi,
          query: searchKey,
        },
      })
      .then((response) => {
        setMovies(response.data.results);
        setMovie(response.data.results[0]);

        if (response.data.results.length) {
          return fetchMovie(response.data.results[0].id);
        }
      })
      .then(() => {})
      .catch((error) => {
        console.error("Error al buscar películas:", error);
        throw error;
      });
  };

  const fetchMovie = (id) => {
    return axios
      .get(`${keyApi}/movie/${id}`, {
        params: {
          api_key: keyApi,
          append_to_response: "videos",
        },
      })
      .then((response) => {
        const data = response.data;
        const trailer =
          data.videos && data.videos.results
            ? data.videos.results.find((vid) => vid.name === "Official Trailer")
            : null;

        setTrailer(trailer ? trailer : data.videos.results[0]);
        setMovie(data);
      })
      .catch((error) => {
        console.error("Error al buscar la película:", error);
        throw error;
      });
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);

    setMovie(movie);
    window.scrollTo(0, 0);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <h2 className="text-center mt-5 mb-5">Trailer Popular Movies</h2>

      <form className="container mb-4" onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
      </form>
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${imagen}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Trailer no disponible"
                    )}
                    <h1 className="textwh">{movie.title}</h1>
                    <p className="textwh">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      <div className="container mt-3">
        <div className="row">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="col-md-4 mb-3"
              onClick={() => selectMovie(movie)}
            >
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt=""
                height={600}
                width="100%"
              />
              <h4 className="text-center">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
