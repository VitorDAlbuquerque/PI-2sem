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

export const useApi = () => ({
  topMovies: async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?language=pt-BR?api_key=794202efde8ce7a78d65e6f431811b5e`,
      options,
    );
    console.log(response.data);
    return {
      movies: response.data.results,
    };
  },
  discoverMovies: async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1?api_key=794202efde8ce7a78d65e6f431811b5e`,
      options,
    );

    return {
      movies: response.data.results,
    };
  },

  popularSeries: async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/popular?language=pt-BR&page=1?api_key=794202efde8ce7a78d65e6f431811b5e`,
      options,
    );

    return {
      series: response.data.results,
    };
  },

  upcoming: async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?language=pt-BR&page=1?api_key=794202efde8ce7a78d65e6f431811b5e`,
      options,
    );

    return {
      movies: response.data.results,
    };
  },
});
