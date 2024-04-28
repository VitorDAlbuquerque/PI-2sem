import MovieCast from "@/components/ui/movieCast";
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

  deleteUsers: async (token: string) => {
    try {
      await axios.delete(
        `http://localhost:3333/deleteUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    } catch (error) {
      console.error('Erro ao excluir conta:', error);
     
    }
  },


  editUserInfo: async (
    token: string,
    name: string,
    email: string,
    password: string,
    birthDate: string,
    gender: string,
    country: string,
    bio: string
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3333/updateUser",
        {
          name,
          email,
          password,
          birthDate,
          gender,
          country,
          bio
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        return true; 
      } else {
        throw new Error("Erro ao editar informações do usuário");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Erro desconhecido ao editar informações do usuário");
      }
    }
  },
  newLike: async(token: string, watchlistId: string) =>{
    await axios.post("http://localhost:3333/newLike", {watchlistId},
    {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
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
    )
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
    return{
      user: response.data
    }
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
  deleteWatchlist: async(token: string, idwl: string)=>{
    const response = await axios.delete(`http://localhost:3333/deleteWatchList/${idwl}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      watchList: response.data
    }
  },
  updateUserTheme: async (token: string, theme:string) => {
    await axios.put(
      `http://localhost:3333/updateUserTheme`,
      {theme},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  },
  updatePassword: async (email: string, password:string) => {
    await axios.put(
      `http://localhost:3333/updatePassword`,
      {email, password},
    )
  },

  getComments: async(watchListId: string)=>{
    const response = await axios.get(`http://localhost:3333/ListComments/${watchListId}`)
    return{
      comments: response.data
    }
  },
  
  newComment: async(token: string, text: string, watchlistId: string)=>{
    const response = await axios.post(`http://localhost:3333/newComment`, {text, watchlistId},
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    )
    return{
      comments: response.data
    }
  },

  favoriteMovie: async(token: string, movieId: string, movieName: string, movieIMG: string)=>{
    const response = await axios.post(`http://localhost:3333/favoriteMovie`, {movieId, movieName, movieIMG},
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    )
    return{
      favorite: response.data
    }
  },
  listFavoriteByMovie: async(movieId: string)=>{
    const response = await axios.get(`http://localhost:3333/listFavoriteMovieByMovie/${movieId}`)
    return{
      favorite: response.data
    }
  },
  setMovieRating: async (movieId: string, token: string, movieBanner: string, text: string, note:number)=>{
    const response = await axios.post('http://localhost:3333/NewAssessment',  {movieId, movieBanner, text, note}, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
  )
  return {
    setMovieRating: response.data
  }
  }
  
});