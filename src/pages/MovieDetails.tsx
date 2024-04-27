import { useState, useEffect, useRef, useContext } from "react";
import { SideBar } from "../components/sidebar";
import { Header } from "../components/header";
import { useTMDBApi } from "../api/useTMDBApi";
import { useParams } from "react-router-dom";

import useMovieTrailer  from "../components/ui/useMovieTrailer";

import MovieCast  from "../components/ui/movieCast";

import { MdFormatListBulletedAdd } from "react-icons/md";
import { BiComment } from "react-icons/bi";


//import { GiKiwiFruit } from "react-icons/gi";



import Comments from "../components/ui/comments";

import { FaRegStar, FaStar } from "react-icons/fa";
import { useBackendApi } from "@/api/useBackendApi";
import { LoginContext } from "@/context/AuthContext";

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

interface MovieComment {
  id: string;
  userId: string;
  text: string;
  user: {
    name: string;
  };
}

interface listFavorites{
  user:{
    id: string
  }
}

export function MovieDetails() {

  const authContext = useContext(LoginContext);

  const { movieId } = useParams<{ movieId: string }>();
  const apiBackend = useBackendApi()
  const api = useTMDBApi();
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("trailer");
  const [comments, {/*setComments*/}] = useState<MovieComment[]>([]);
  const [showTrailer,  {/*setShowTrailer*/}] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<listFavorites[]>([]);
  const [updateFavorites, setUpdateFavorites] = useState(false);

  const { trailerId } = useMovieTrailer(movieId || '');
  

  const commentsSectionRef = useRef<HTMLDivElement>(null);

  const rateMovie = () => {
   
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const addToWatchlist = () => {};

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (!movieId) {
          return;
        }
        const details = await api.getMovieDetails(movieId);
        console.log('Detalhes do filme:', details);
        setMovieDetails(details);
        if (details.videos?.results.length > 0) {

        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    };
    fetchMovieDetails();

    async function listFavorites(){
      if(movieId){
        const data = await apiBackend.listFavoriteByMovie(movieId)
        if(data){
          setFavorites(data.favorite)
          console.log(data.favorite)
        }
      }
    }
    listFavorites()

  }, [updateFavorites, movieId]);

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
  
              {favorites.length>0?
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
                <BiComment className="text-3xl text-lightGreen cursor-pointer transition-all ease-in-out duration-200 "    onClick={rateMovie}/>
  
              </button>
  
              <p className="text-slate-400 hover:text-lightGreen cursor-pointer transition-all ease-in-out duration-200 ml-24 mr-5">
                Adicionar filme a watchlist
              </p>
              <button
               
             
              >
               <MdFormatListBulletedAdd    onClick={addToWatchlist} className="text-3xl text-lightGreen cursor-pointer transition-all ease-in-out duration-200 " />
  
              </button>
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
  
        <div ref={commentsSectionRef} >
          <Comments comments={comments} />
        </div>
      </div>
    </div>
  );
}