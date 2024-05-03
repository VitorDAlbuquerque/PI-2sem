import axios from "axios";


const URLHost = 'http://localhost:3333'

export const useBackendApi = () => ({

  auth: async (email: string, password: string) => {
    const response = await axios.post(`${URLHost}/auth`, {
      email,
      password,
    });
    return {
      user: response.data.userExists,
      token: response.data.token,
    };
  },
  validateAuth: async (token: string) => {
    const response = await axios.get(`${URLHost}/validateAuth`, {
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
    const response = await axios.post(`${URLHost}/createNewUser`, {
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
        `${URLHost}/deleteUsers`,
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
        `${URLHost}/updateUser`,
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
    await axios.post(`${URLHost}/newLike`, {watchlistId},
    {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
  },
  editWatchList: async (token: string, idwl: string, name: string, description: string, privacy: boolean) => {
    await axios.put(
      `${URLHost}/updateWatchlist`,
      {idwl, name, description, privacy},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  },
  getPopularWatchLists: async()=>{
    const response = await axios.get(`${URLHost}/ListPopularWacthList`)
    return{
      watchList: response.data
    }
  },
  getWatchListById: async(id: string)=>{
    const response = await axios.get(`${URLHost}/listWatchListById/${id}`,)
    return{
      watchList: response.data
    }
  },
  getMoviesOnWatchList: async(watchListId: string)=>{
    const response = await axios.post(`${URLHost}/MoviesOnLists`, {watchListId})
    return{
      moviesOnWatchList: response.data
    }
  },
  addMoviesWatchList: async(token: string, watchListId: string, movieId: number, movieName: string,  movieURLImg: string)=>{
    const response = await axios.post(`${URLHost}/addMovie`, {movieName, watchListId, movieId, movieURLImg}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return{
      moviesOnWatchList: response.data
    }
  },
  getUserById: async(id: string)=>{
    const response = await axios.get(`${URLHost}/userById/${id}`)
    return{
      user: response.data
    }
  },
  createNewWatchList: async(token: string, name: string, description: string, privacy: boolean, firstMovieId: number, movieName: string, movieURLImg: string, movieBanner: string)=>{
    const response = await axios.post(`${URLHost}/createNewWatchList`, {name, description, privacy, firstMovieId, movieName, movieURLImg, movieBanner},
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
    const response = await axios.get(`${URLHost}/listWatchListByUser/${id}`)
    return{
      watchList: response.data
    }
  },
  deleteWatchlist: async(token: string, idwl: string)=>{
    const response = await axios.delete(`${URLHost}/deleteWatchList/${idwl}`,
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
      `${URLHost}/updateUserTheme`,
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
      `${URLHost}/updatePassword`,
      {email, password},
    )
  },

  getComments: async(watchListId: string)=>{
    const response = await axios.get(`${URLHost}/ListComments/${watchListId}`)
    return{
      comments: response.data
    }
  },
  
  newComment: async(token: string, text: string, watchlistId: string)=>{
    const response = await axios.post(`${URLHost}/newComment`, {text, watchlistId},
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
    const response = await axios.post(`${URLHost}/favoriteMovie`, {movieId, movieName, movieIMG},
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
    const response = await axios.get(`${URLHost}/listFavoriteMovieByMovie/${movieId}`)
    return{
      favorite: response.data
    }
  },
  setMovieRating: async ( token: string, text: string,  rating: number,  movieBanner: string, movieId: string)=>{
    const response = await axios.post(`${URLHost}/NewReview`,  {text, rating, movieId, movieBanner }, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return {
      setMovieRating: response.data
    }
  },
  listCommentsMovie: async(movieId: string)=>{
    const response = await axios.get(`${URLHost}/ListReview/${movieId}`)
    return{
      comments: response.data
    }
  },
  listCommentsUserMovie: async(token:string, movieId: string)=>{
    const response = await axios.get(`${URLHost}/GetReviewByUser/${movieId}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return{
      comments: response.data
    }
  },
  deleteReview: async(token: string, movieId: string)=>{
    const response = await axios.delete(`${URLHost}/DeleteReview/${movieId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      review: response.data
    }
  },

  listWatchListByUserToken: async(token: string)=>{
    const response = await axios.get(`${URLHost}/listWatchListByUserToken`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return{
      watchList: response.data
    }
  },

  updateReview: async(token: string, text: string, rating: number, movieId: string)=>{
    const response = await axios.put(`${URLHost}/UpdateReview`, {text, rating, movieId}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return{
      review: response.data
    }
  },

  listFavoriteMovieByUser: async(userId: string)=>{
    const response = await axios.get(`${URLHost}/listFavoriteMovieByUser/${userId}`)
    return{
      favorite: response.data
    }
  },

  listReviewByUser: async(userId: string)=>{
    const response = await axios.get(`${URLHost}/listReviewByUser/${userId}`)
    return{
      review: response.data
    }
  },
});