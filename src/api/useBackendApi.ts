import axios from "axios";

export const useBackendApi = () => ({
  auth: async (email: string, password: string) => {
    const response = await axios.post(`http://localhost:3333/auth`, {
      email,
      password,
    });
    return {
      user: response.data.userExists,
      token: response.data.token,
    };
  },
  validateAuth: async (token: string) => {
    const response = await axios.get("http://localhost:3333/validateAuth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      user: response.data,
    };
  },
  logout: async () => {
    return {
      status: true,
    };
  },

  createNewUser: async (
    name: string,
    email: string,
    password: string,
    birthDate: string,
    gender: string,
    country: string,
  ) => {
    const response = await axios.post("http://localhost:3333/createNewUser", {
      name,
      email,
      password,
      birthDate,
      gender,
      country,
    });

    return {
      user: response.data.newUser,
      token: response.data.token,
    };
  },

  createNewWatchList: async(token: string, name: string, description: string, privacy: boolean, firstMovieId: number, movieName: string, movieURLImg: string, movieBanner: string)=>{
    const response = await axios.post("http://localhost:3333/createNewWatchList", {name, description, privacy, firstMovieId, movieName, movieURLImg, movieBanner},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      watchlist: response.data,
    };
  },
  listWatchListByUser: async(id: string)=>{
    const response = await axios.get(`http://localhost:3333/listWatchListByUser/${id}`)
    return{
      watchList: response.data
    }
  },
  getPopularWatchLists: async()=>{
    const response = await axios.get("http://localhost:3333/ListPopularWacthList")
    return{
      watchList: response.data
    }
  },
  getWatchListById: async(id: string)=>{
    const response = await axios.get(`http://localhost:3333/listWatchListById/${id}`,)
    return{
      watchList: response.data
    }
  },
  getMoviesOnWatchList: async(watchListId: string)=>{
    const response = await axios.post("http://localhost:3333/MoviesOnLists", {watchListId})
    return{
      moviesOnWatchList: response.data
    }
  },
  addMoviesWatchList: async(token: string, watchListId: string, movieId: number, movieName: string,  movieURLImg: string)=>{
    const response = await axios.post("http://localhost:3333/addMovie", {movieName, watchListId, movieId, movieURLImg}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return{
      moviesOnWatchList: response.data
    }
  },
  getUserById: async(id: string)=>{
    const response = await axios.get(`http://localhost:3333/userById/${id}`)
    console.log(response.data)
    return{
      user: response.data
    }
  },
  deleteUsers: async (token: string) => {
    await axios.post(
      `http://localhost:3333/deleteUsers`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  },
  editWatchList: async (token: string, idwl: string, name: string, description: string, privacy: boolean) => {
    await axios.put(
      `http://localhost:3333/updateWatchlist`,
      {idwl, name, description, privacy},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  },
  newLike: async(token: string, watchlistId: string) =>{
    console.log(watchlistId)
    await axios.post("http://localhost:3333/newLike", {watchlistId},
    {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
  }
});
