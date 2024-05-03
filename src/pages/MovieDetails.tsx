import { useState, useEffect, useRef, useContext, FormEvent } from "react";
import { SideBar } from "../components/sidebar";
import { Header } from "../components/header";
import { useTMDBApi } from "../api/useTMDBApi";
import { useNavigate, useParams } from "react-router-dom";

import homelander from "../assets/homelander-1-1.jpg";

import useMovieTrailer  from "../components/ui/useMovieTrailer";

import MovieCast  from "../components/ui/movieCast";

import { MdFormatListBulletedAdd } from "react-icons/md";
import { BiComment } from "react-icons/bi";
import { GiKiwiFruit } from "react-icons/gi";
import { BsInfoSquare } from "react-icons/bs";
import { FaRegStar, FaStar } from "react-icons/fa";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { PiDotsThreeBold } from "react-icons/pi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useBackendApi } from "@/api/useBackendApi";
import { LoginContext } from "@/context/AuthContext";

interface Comment {
  movieId: string;
  userId: string;
  text: string;
  rating: number;
  user: {
    name: string;
  };
}

interface MovieDetails {
  id: number;
  profile_path: string;
  name: string;
  character: string;
}

interface MovieGenre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  adult: boolean;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;

  genres: MovieGenre[];
  production_countries: { name: string }[];
  status: string;
  original_language: string;
  budget: number;
  tagline: string;
  production_companies: ProductionCompany[];
}

interface listFavorites{
  user:{
    id: string
  }
}

interface watchlistProps {
  id: string,
  name: string,
  description: string,
  privacy: boolean,
  numberLikes: number,
  banner: string,
  user: {
    name: string,
    id: string
  },
  isLiked: [{
    userId: string,
    watchListId: string
  }],
  comment: [{
    userId: string,
  }]
}

export function MovieDetails() {
  //inicio de comments
  const [comments, setComments] = useState<Comment[]>([]);

  const apiBackend = useBackendApi()
  const navigate = useNavigate();

  const [rating, setRating] = useState(Number);

  //fim de comments

  const authContext = useContext(LoginContext);

  const { movieId } = useParams<{ movieId: string }>();
  const api = useTMDBApi();
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("trailer");


  const [showTrailer,  {/*setShowTrailer*/}] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<listFavorites[]>([]);
  const [updateFavorites, setUpdateFavorites] = useState(false);

  const [userComment, setUserComment] = useState<Comment>();
  const [alterComment, setAlterCommet] = useState(false);
  const [watchlistId, setWatchlistId] = useState('');

  const [textAlterComment, setTextAlterComment] = useState('')

  const { trailerId } = useMovieTrailer(movieId || '');
  
  const commentsSectionRef = useRef<HTMLDivElement>(null);


  const rateMovie = () => {
   
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [watchlist, setWatchlist] = useState<watchlistProps[]>([]);

  useEffect(() => {
   
    const fetchMovieDetails = async () => {
      try {
        if (!movieId) {
          return;
        }
        const details = await api.getMovieDetails(movieId);
        setMovieDetails(details);
        if (details.videos?.results.length > 0) {

        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    };
    fetchMovieDetails();

    async function getUserComment(){
      const storageData = localStorage.getItem("authToken");
      if(storageData && movieId){
        const data = await apiBackend.listCommentsUserMovie(storageData, movieId)
        if(data){
          setUserComment(data.comments)
          
        }
      }
    }
    getUserComment()

    async function getWatchLists() {
      const storageData = localStorage.getItem("authToken");
      if(storageData){
        const data = await apiBackend.listWatchListByUserToken(storageData);
        if (data) {
          setWatchlist(data.watchList);
        }
      }
    }
    getWatchLists()

    async function listFavorites(){
      if(movieId){
        const data = await apiBackend.listFavoriteByMovie(movieId)
        if(data){
          setFavorites(data.favorite)
        }
      }
    }
    listFavorites()

    async function getComments(){
      if(movieId){
        const data = await apiBackend.listCommentsMovie(movieId)
        if(data){
          setComments(data.comments)
        }
      }
    }
    getComments()
  }, [updateFavorites, movieId]);

  //adicionar a watchlist

  const [newMovieAtListDialog, setNewMovieAtListDialog] = useState(false)

  const [popoverVisible, setPopoverVisible] = useState(false);

  const PopoverInfo = () => {
    setPopoverVisible(!popoverVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function addFavorite(){
    const storageData = localStorage.getItem("authToken");
    if (storageData && movieDetails && movieId) {
      await apiBackend.favoriteMovie(storageData, movieId, movieDetails?.title, movieDetails.poster_path);
      setUpdateFavorites(!updateFavorites)
    }
  }

  const getReleaseDateFormatted = (releaseDate: string) => {
    const date = new Date(releaseDate);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };


  async function newReview(e: FormEvent){
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    const storageData = localStorage.getItem("authToken");
    if(storageData && movieDetails){
      await apiBackend.setMovieRating(storageData, String(data.text), rating, movieDetails.poster_path, String(movieDetails.id))
      setUpdateFavorites(!updateFavorites)
    }
  }

  async function deleteReview(){
    const storageData = localStorage.getItem("authToken");
    if(storageData && movieId){
      await apiBackend.deleteReview(storageData, movieId)
      setRating(0)
      setUpdateFavorites(!updateFavorites)
    }
  }

  async function addMoviesOnWatchlist(){
    const storageData = localStorage.getItem("authToken");
    if(storageData && movieId && movieDetails){
      console.log(watchlistId)
      await apiBackend.addMoviesWatchList(storageData, watchlistId, movieDetails.id, movieDetails.title, movieDetails.poster_path)
      setUpdateFavorites(!updateFavorites)
    }
  }


  async function updateReview(e: FormEvent){
    e.preventDefault();
    const storageData = localStorage.getItem("authToken");
    if(storageData && movieId && movieDetails){
      await apiBackend.updateReview(storageData, textAlterComment, rating, movieId)
      setUpdateFavorites(!updateFavorites)
      setAlterCommet(false)
    }
  }

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "trailer":
      return (
        <div className="">
          {showTrailer && ( 
            <div className="flex items-center justify-center">
              <iframe
                src={`https://www.youtube.com/embed/${trailerId}`} 
                title="Trailer"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          )}
         
        </div>
      );

      case "cast":
        return (
          <div className="m-10 text-center p-8 ">
            <p className="text-2xl text-constrastColor font-semibold mb-12 text-center">
              Elenco de {movieDetails?.title}
            </p> 
            {movieId && <MovieCast movieId={movieId} />} 
          </div>
        );
      case "moreInfo":
        return (
          <div className="m-10 p-8">
            <div className="text-2xl text-constrastColor font-semibold mb-4 text-center">
              Mais informações sobre {movieDetails?.title}
            </div>
            <div className="text-lg mb-4 text-center font-semibold">
            <p className="text-gray-500">{movieDetails?.tagline ? movieDetails.tagline : "Tagline indisponível"}</p>
            </div>
            <div className="text-lg mb-4 text-center">
              <p className="text-gray-500">
                Disponibilidade: {movieDetails?.status === "Released" ? "Disponível" : "Ainda não disponível"}
              </p>
            </div>
            <div className="text-lg mb-4 text-center">
              <p className="text-gray-500">
                Idioma original:{" "}
                {movieDetails?.original_language === "en"
                  ? "Inglês"
                  : movieDetails?.original_language}
              </p>
            </div>
            <div className="text-lg mb-4 text-center">
              <p className="text-gray-500 ">
                Orçamento:{" "}
                {movieDetails?.budget.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div className="text-lg mb-4 text-center">
              <p className="text-gray-500">Empresa de produção:</p>
              <ul className="text-gray-500">
                {movieDetails?.production_companies?.map((company) => (
                  <li key={company.id}>{company.name}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="bg-mainBg flex-initial w-full min-h-screen font-montserrat">
        <Header />

        <div className={`mx-20 my-8 p-10 ${isMobile ? "flex flex-col items-center" : "flex flex-row"}`}>
          <div className={`flex-none mx-5 mr-8  ${isMobile ? "mb-8" : "w-1/4 md:w-auto md:mr-8"}`}>
            <img
              src={movieDetails?.poster_path ? `https://image.tmdb.org/t/p/w300/${movieDetails.poster_path}` : ""}
              className={`max-h-max w-auto`}
              alt="Pôster do filme"
            />
          </div>
          <div className={`flex-grow w-full ${isMobile ? "" : "md:w-3/4"} text-mainFontColor`}>
            <h1 className={`text-4xl font-bold mb-4 flex items-center gap-3 text-lightGreen ${isMobile ? "text-center" : "text-"}`}>
              {movieDetails?.title}{" "}
              {movieDetails?.release_date && (
                <span className="text-gray-500">({new Date(movieDetails.release_date).getFullYear()})</span>
              )}
  
              {authContext.user?
                favorites.length>0?
                  favorites.slice(favorites.length-1, favorites.length).map(favorite =>{
                    if(favorite.user.id == authContext.user?.id){
                      return(
                        <p key={`${movieId}${favorite.user.id}`} onClick={addFavorite} className="text-constrastColor cursor-pointer hover:text-constrastColor transition-all duration-200">
                          <FaStar/>
                        </p>
                      )
                    }else{
                      return(
                        <p key={`${movieId}${favorite.user.id}`} onClick={addFavorite} className="text-gray-500 cursor-pointer hover:text-constrastColor transition-all duration-200">
                          <FaRegStar/>
                        </p>
                      )
                    }
                    
                  })
                :
              <p onClick={addFavorite} className="text-gray-500 cursor-pointer hover:text-constrastColor transition-all duration-200">
                <FaRegStar/>
              </p>
              :null
              }
              
            </h1>
            <div className="flex items-center">
              <p className="text-slate-400 hover:text-lightGreen cursor-pointer transition-all ease-in-out duration-200 mr-5" onClick={rateMovie}>
                Avaliar filme
              </p>
              <button
                className=""
                onClick={rateMovie}
              >
                <BiComment className="text-3xl text-lightGreen cursor-pointer transition-all ease-in-out duration-200"    onClick={rateMovie}/>
  
              </button>

             
              <Dialog open={newMovieAtListDialog} onOpenChange={setNewMovieAtListDialog}>
                <DialogTrigger>
                  <div className="flex items-center">
                    <p className="text-slate-400 hover:text-lightGreen cursor-pointer transition-all ease-in-out duration-200 ml-24 mr-5">
                      Adicionar filme a watchlist 
                    </p>
                    <p>
                      <MdFormatListBulletedAdd    className="text-3xl text-lightGreen cursor-pointer transition-all ease-in-out duration-200 " />
                    </p>
                  </div>
                </DialogTrigger>
              <DialogContent  className="max-w-96 rounded-lg text-left">
              <DialogHeader>
                <DialogTitle>Adicionar {movieDetails?.title} a Watchlist </DialogTitle>
                <DialogDescription>
                  Adicione filmes e expanda sua lista!
                </DialogDescription>
              </DialogHeader>
              <div>
                <div className="text-sm text-slate-500 flex flex-col gap-4">
                  <div>
                    <p className="text-center mb-3"> Selecione em qual lista você deseja adicionar {movieDetails?.title}:</p>
            

                    <select value={watchlistId} onChange={(e)=>{
                      setWatchlistId(e.target.value)
                      }} className=" w-full h-10 border rounded-md">
                      <option value="" disabled hidden>Selecione a lista...</option>
                      {watchlist.map(watchlist =>{
                          return(
                            <option key={watchlist.id} value={watchlist.id}>{watchlist.name}</option>
                          )
                        })}
                    </select>
        
     </div>
                            
     <div className="flex items-center justify-end gap-5 ">
      <DialogClose onClick={()=>{
           
}} 
        className="bg-gray-300 w-20 p-2 rounded-lg hover:brightness-75 transition-all duration-200">
         Cancelar
         </DialogClose>
                                
       <button onClick={()=>addMoviesOnWatchlist()} className="border-2 w-20 bg-white border-constrastColor p-2 rounded-lg hover:brightness-90 transition-all duration-200">
          Adicionar
        </button>
        </div>
        </div>
      </div>
    </DialogContent>
     </Dialog>


            </div>
            <div className={`text-text-sm mb-2 mt-6 ${isMobile ? "text-center" : "text-"}`}>
              <span className="font-semibold">Classificação indicativa:</span>{" "}
              {movieDetails?.adult ? "18+" : "Livre"}
            </div>
            <div className={`text-text-sm mb-2 ${isMobile ? "text-center" : "text-"}`}>
              <span className="font-semibold">Data de lançamento:</span>{" "}
              {movieDetails?.release_date && getReleaseDateFormatted(movieDetails.release_date)}
            </div>
            <div className={`text-text-sm mb-2 ${isMobile ? "text-center" : "text-"}`}>
              <span className="font-semibold">País de origem:</span>{" "}
              {movieDetails?.production_countries?.[0]?.name}
            </div>
            <div className={`text-text-sm mb-2 ${isMobile ? "text-center" : "text-"}`}>
              <span className="font-semibold">Gênero:</span>{" "}
              {movieDetails?.genres?.map((genre) => genre.name).join(", ")}
            </div>
  
            <div className={`text-lg my-6 max-w-4xl ${isMobile ? "text-center" : ""}`}>{movieDetails?.overview}</div>
          </div>
        </div>
  
        <div className={`mx-auto text-gray-500 text-xl font-semibold flex ${isMobile ? "justify-center flex-wrap" : "justify-center"}`}>
          <button className={`mx-4 my-2 ${selectedOption === "trailer" ? "text-lightGreen border-b-2 border-lightGreen" : ""}`} onClick={() => setSelectedOption("trailer")}>
            Trailer
          </button>
          <button className={`mx-4 my-2 ${selectedOption === "cast" ? "text-lightGreen border-b-2 border-lightGreen" : ""}`} onClick={() => setSelectedOption("cast")}>
            Elenco
          </button>
          <button className={`mx-4 my-2 ${selectedOption === "moreInfo" ? "text-lightGreen border-b-2 border-lightGreen" : ""}`} onClick={() => setSelectedOption("moreInfo")}>
            Mais informações
          </button>
        </div>
  
        {selectedOption === "trailer" && trailerId && (
          <div className="m-10 p-8 text-center">
            <h1 className="text-2xl font-semibold text-constrastColor mb-8">
              Assista ao trailer de {movieDetails?.title}
            </h1>
            <div className="flex items-center justify-center">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailerId}`} 
                title="Trailer"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
  
        {renderSelectedOption()}
  
        <div>
        <div className="mt-10 bg-bgAside p-10">
      <h1 className="text-constrastColor font-semibold text-2xl mb-6">COMENTÁRIOS</h1>

      {authContext.user?
      authContext.user?.id != userComment?.userId? (
        <div className="flex items-center mb-12 gap-4 ">
          <img className="h-12 w-12 rounded-full object-cover" src="https://i.pinimg.com/236x/93/36/08/93360829e98e2db2aa3ef0d4ae381383.jpg" alt="foto da hello kitty pq não consigo importar a do homelander" />

          <form onSubmit={newReview}>
          <div className="flex flex-col gap-2 ">
            <div className="h-10 text-gray-400 px-3 py-6 bg-slate-900 hover:border-constrastColor transition-all duration-200 border-2 border-slate-400 rounded-sm justify-center flex items-center">

            <button data-ripple-light="true" 
            onClick={PopoverInfo} data-popover-target="popover"
            className="">
            <BsInfoSquare className="mr-2 cursor-pointer" />
          </button>
          {popoverVisible && (
          <div
            data-popover="popover"
            className="absolute p-4  text-sm  break-words whitespace-normal bg-mainFontColor border rounded-lg w-1/3 bg-opacity-95  text-darkGreen shadow-blue-gray-500/10 focus:outline-none -mt-48 "><p>
            Utilizamos o kiwi como forma de avaliação. Quanto mais kiwis um filme tiver, maior será sua recomendação. </p><p>Os kiwis vão de 1 a 5, onde 1 kiwi representa uma má avaliação e 5 kiwis uma ótima avaliação.</p>
            <button
      onClick={PopoverInfo}
      className="absolute top-0 right-0 mt-1 mr-1 text-gray-400 hover:text-gray-700 focus:outline-none"
    >
      <svg className="w-4 m-1 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.707 1.707a1 1 0 011.414 0L10 8.586l7.879-7.88a1 1 0 111.414 1.414L11.414 10l7.88 7.879a1 1 0 11-1.414 1.414L10 11.414l-7.879 7.88a1 1 0 01-1.414-1.414L8.586 10 1.707 2.121a1 1 0 010-1.414z"
        />
      </svg>
    </button>
          </div>
        )}
          
              <p className="text-mainFontColor">
                Quantos kiwis esse filme merece?
              </p> 
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${rating >= index ? 'text-constrastColor' : 'text-gray-400'}`}
                  onClick={() => {setRating(index)}}
                >
                <GiKiwiFruit />
                </button> 
              ))}
            </div>
          
            <input
              name="text"
              className="px-3 h-10 w-full py-8 rounded-sm outline-none border-2 border-slate-400 bg-slate-900 text-slate-400 focus:border-constrastColor transition-all duration-200"
              type="text"
              defaultValue={userComment?.text}
              placeholder="Adicione um novo comentário..."
            />
          </div>
            <button  type="submit" className="h-10 text-gray-400 px-3 hover:border-constrastColor transition-all duration-200 border-2 border-slate-400 rounded-sm justify-center flex items-center mt-4">Avaliar</button>
          </form>

        </div>
      ) : null
    :null}
                
      <div>
        {comments.map((comment) => {
          if(comment.userId == authContext.user?.id){
            if(!alterComment){
              return (
                <div key={`${comment.userId}${comment.movieId}`} className="mb-6">
                    <div className="flex items-center gap-2 text-gray-400">
                        <img className="h-10 w-10 rounded-full object-cover" src={homelander} alt="" />
                        <p onClick={()=>{
                            navigate(`/Profile/${comment.userId}`)
                            window.scrollTo({top: 0})
                            }} className="font-semibold hover:text-constrastColor hover:underline cursor-pointer transition-all duration-200">{comment.user.name}</p>
                        
                        <Popover>
                          <PopoverTrigger><p className="text-3xl"><PiDotsThreeBold/></p></PopoverTrigger>
                          <PopoverContent className="p-2 max-w-44 ">
                            <div className="cursor-pointer hover:bg-gray-400 rounded-sm transition-all duration-200 p-1" onClick={()=>{
                              setAlterCommet(true)
                              setRating(comment.rating)
                              setTextAlterComment(comment.text)
                            }}>
                              Editar avaliação
                            </div>
                            <Dialog>
                              <DialogTrigger className="w-full">
                                <div className="cursor-pointer hover:bg-red-300 hover:text-red-600 rounded-sm transition-all duration-200 p-1 flex justify-normal">
                                  Remover avaliação
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-[460px] rounded-lg">
                                <DialogHeader>
                                  <DialogTitle>Tem certeza que deseja remover sua avalição?</DialogTitle>
                                  <DialogDescription>
                                    Sua avaliação será removida permanentemente!
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center">
                                  <button onClick={deleteReview} className="border-2 w-96 border-constrastColor p-2 rounded-lg hover:border-red-400 transition-all duration-200">
                                    Remover
                                  </button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                          </PopoverContent>
                        </Popover>
  
                    </div>
                    <p className="relative left-12 flex gap-2 items-center text-gray-400 max-w-[600px]">{comment.rating}/5 <b className="text-constrastColor"><GiKiwiFruit/></b></p>
  
                    <p className="relative left-12 text-gray-400 max-w-[600px]">{comment.text}</p>
                </div>
              );
            } else {
              return (
              <div key={`${comment.userId}${comment.movieId}`} className="flex items-center mb-12 gap-4 ">
          <img className="h-12 w-12 rounded-full object-cover" src="https://i.pinimg.com/236x/93/36/08/93360829e98e2db2aa3ef0d4ae381383.jpg" alt="foto da hello kitty pq não consigo importar a do homelander" />

          <form onSubmit={updateReview}>
          <div className="flex flex-col gap-2 ">
            <div className="h-10 text-gray-400 px-3 py-6 bg-slate-900 hover:border-constrastColor transition-all duration-200 border-2 border-slate-400 rounded-sm justify-center flex items-center">

            <button data-ripple-light="true" 
            onClick={PopoverInfo} data-popover-target="popover"
            className="">
            <BsInfoSquare className="mr-2 cursor-pointer" />
          </button>
          {popoverVisible && (
          <div
            data-popover="popover"
            className="absolute p-4  text-sm  break-words whitespace-normal bg-mainFontColor border rounded-lg w-1/3 bg-opacity-95  text-darkGreen shadow-blue-gray-500/10 focus:outline-none -mt-48 "><p>
            Utilizamos o kiwi como forma de avaliação. Quanto mais kiwis um filme tiver, maior será sua recomendação. </p><p>Os kiwis vão de 1 a 5, onde 1 kiwi representa uma má avaliação e 5 kiwis uma ótima avaliação.</p>
            <button
      onClick={PopoverInfo}
      className="absolute top-0 right-0 mt-1 mr-1 text-gray-400 hover:text-gray-700 focus:outline-none"
    >
      <svg className="w-4 m-1 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.707 1.707a1 1 0 011.414 0L10 8.586l7.879-7.88a1 1 0 111.414 1.414L11.414 10l7.88 7.879a1 1 0 11-1.414 1.414L10 11.414l-7.879 7.88a1 1 0 01-1.414-1.414L8.586 10 1.707 2.121a1 1 0 010-1.414z"
        />
      </svg>
    </button>
          </div>
        )}
          
              <p className="text-mainFontColor">
                Quantos kiwis esse filme merece?
              </p> 
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${rating >= index ? 'text-constrastColor' : 'text-gray-400'}`}
                  onClick={() => {setRating(index)}}
                >
                <GiKiwiFruit />
                </button> 
              ))}
            </div>
          
             <input
              name="text"
              className="px-3 h-10 w-full py-8 rounded-sm outline-none border-2 border-slate-400 bg-slate-900 text-slate-400 focus:border-constrastColor transition-all duration-200"
              value={textAlterComment}
              onChange={(e)=>setTextAlterComment(e.target.value)}
              type="text"
              placeholder="Adicione um novo comentário..."
            />
          </div>
          <div className="flex gap-5">
            <button className="h-10 text-gray-400 px-3 hover:border-red-400 transition-all duration-200 border-2 border-slate-400 rounded-sm justify-center flex items-center mt-4" onClick={()=>setAlterCommet(false)}>Cancelar</button>
            <button type="submit" className="h-10 text-gray-400 px-3 hover:border-constrastColor transition-all duration-200 border-2 border-slate-400 rounded-sm justify-center flex items-center mt-4">Avaliar</button>
          </div>
            
          </form>

        </div>
              )
            }
            
          } else {
            return (
              <div key={`${comment.userId}${comment.movieId}`} className="mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                      <img className="h-10 w-10 rounded-full object-cover" src={homelander} alt="" />
                      <p onClick={()=>{
                          navigate(`/Profile/${comment.userId}`)
                          window.scrollTo({top: 0})
                          }} className="font-semibold hover:text-constrastColor hover:underline cursor-pointer transition-all duration-200">{comment.user.name}</p>
                      <p className="flex gap-2 items-center">{comment.rating}/5 <b className="text-constrastColor"><GiKiwiFruit/></b></p>
                  </div>
                  <p className="relative left-12 text-gray-400 max-w-[600px]">{comment.text}</p>
              </div>
            );
          }
          
        })}
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}