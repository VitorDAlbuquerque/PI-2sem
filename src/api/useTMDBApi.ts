import axios from "axios";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTQyMDJlZmRlOGNlN2E3OGQ2NWU2ZjQzMTgxMWI1ZSIsInN1YiI6IjY1OTViNzAwNTkwN2RlMDcwYjYzYmY2NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.u_7yedc2h-nW7QHdEiv69c173CX8SSHIJpRJYK-BTm8",
  },
};

fetch("https://api.themoviedb.org/3/authentication", options)
  .then((response) => response.json())
  .then()
  .catch((err) => console.error(err));

export const useTMDBApi = () => ({
  getPopularMovies: async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?language=pt-BR?api_key=794202efde8ce7a78d65e6f431811b5e`,
      options,
    );
    return {
      movies: response.data.results,
    };
  },
  getTopRatedMovies: async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?language=pt-BR?api_key=794202efde8ce7a78d65e6f431811b5e`,
      options,
    );
    return {
      movies: response.data.results,
    };
  },
  getNowPlaying: async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?language=pt-BR?api_key=794202efde8ce7a78d65e6f431811b5e`,
      options,
    );
    return {
      movies: response.data.results,
    };
  },
  getAllGenres: async () => {
    const response = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?language=pt",
      options,
    );
    return {
      genres: response.data.genres,
    };
  },
});
