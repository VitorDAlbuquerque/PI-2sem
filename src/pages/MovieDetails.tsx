import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { SideBar } from "../components/sidebar";
import { Header } from "../components/header";
import { useTMDBApi } from "../api/useTMDBApi";
import { useParams } from "react-router-dom";
import Trailer from "../components/ui/trailer";
import Slider from "react-slick";
import UserReviews from "../components/ui/userReviews"; 


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function MovieDetails() {


  
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerId, setTrailerId] = useState("");
    const { movieId } = useParams();
    const api = useTMDBApi();
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('overview');
    const [cast, setCast] = useState<any[]>([]); 

    const rateMovie = () => {
      
      };
    
      const addToWatchlist = () => {
        //  adicionar o filme à watchlist
      };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (!movieId) {
          return;
        }
        const details = await api.getMovieDetails(movieId);
        setMovieDetails(details);
        if (details.videos?.results.length > 0) {
          setTrailerId(details.videos.results[0].key);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    };
    fetchMovieDetails();
  }, [api, movieId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);



  if (cast && cast.length > 0) {
    cast.map((actor: { id: Key | null | undefined; profile_path: any; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; character: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
      <div key={actor.id}>
        <img src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}  />
        <p>{actor.name}</p>
        <p>{actor.character}</p>
      </div>
    ));
  }

  const renderCastCarousel = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4
    };
  
    return (
      <Slider {...settings}>
        {movieDetails?.credits?.cast.map((castMember: any) => (
          <div key={castMember.id}>
           <img
         src={`https://image.tmdb.org/t/p/w500/${castMember.profile_path}`}
         alt={castMember.name}
         className="mx-auto"
    />
            <p className="text-center mt-2">{castMember.name}</p>
            <p className="text-center text-gray-500">{castMember.character}</p>
          </div>
        ))}
      </Slider>
    );
  };

  const getReleaseDateFormatted = (releaseDate: string) => {
    const date = new Date(releaseDate);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };

  const [userReviews, setUserReviews] = useState([
    { user: "João", rating: 8, comment: "Ótimo filme!" },
    { user: "Maria", rating: 9, comment: "Adorei a atuação dos atores!" },
    { user: "Pedro", rating: 7, comment: "Interessante, mas esperava mais." },
  ]);

  const renderSelectedOption = () => {
    switch (selectedOption) {
        case 'trailer':
            return (
              <div className="m-10 p-8 text-center">
                <h1 className="text-2xl font-semibold text-constrastColor">Assista ao trailer de {movieDetails?.title}</h1>
                
                <div className="flex justify-center mt-4">
                  {trailerId && (
                    <button
                      className="bg-constrastColor text-darkGreen p-4 m-1 rounded-lg font-semibold max-w-72 font-montserrat hover:brightness-75 transition-all ease-in-out duration-200 shadow-sm shadow-constrastColor"
                      onClick={() => setShowTrailer(true)}
                    >
                      Assistir ao Trailer
                    </button>
                  )}
                </div>
    
                {showTrailer && (
                  <Trailer
                    trailer_id={trailerId}
                    handler_show_trailer={setShowTrailer}
                    show_trailer={showTrailer}
                  />
                )}
              </div>
            );
      case 'cast':
        return (
            <div className="m-10 p-8">
              <p className="text-2xl text-constrastColor font-semibold mb-4 text-center">
                Elenco de {movieDetails?.title}
              </p>
              <div className="flex flex-wrap justify-center">
                {renderCastCarousel()}
              </div>
            </div>
          );
        case 'moreInfo':
        return (
          <div className="m-10 p-8">
            <div className="text-2xl text-constrastColor font-semibold mb-4 text-center">
              Mais informações sobre {movieDetails?.title}
            </div>
            <div className="text-lg mb-4 text-center font-semibold">
              <p className="text-gray-500">"{movieDetails?.tagline}"</p>
            </div>
            <div className="text-lg mb-4 text-center">
              <p className="text-gray-500">Estado: {movieDetails?.status === "Released" ? "Lançado" : "Não lançado"}</p>
            </div>
            <div className="text-lg mb-4 text-center">
              <p className="text-gray-500">Idioma original: {movieDetails?.original_language === "en" ? "Inglês" : movieDetails?.original_language}</p>
            </div>
            <div className="text-lg mb-4 text-center">
              <p className="text-gray-500 ">Orçamento: {movieDetails?.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div className="text-lg mb-4 text-center">
              <p className="text-gray-500">Empresa de produção:</p>
              <ul className="text-gray-500">
                {movieDetails?.production_companies?.map((company: any) => (
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
      <div className="bg-mainBg flex-initial w-full min-h-screen font-montserrat ">
        <Header />
        
        <div className={`m-8 p-10 ${isMobile ? 'flex flex-col items-center' : 'flex flex-row'}`}>
          <div className={`flex-none mx-8  ${isMobile ? 'mb-8' : 'w-1/4 md:w-auto md:mr-8'}`}>
            
            <img
              src={movieDetails?.poster_path ? `https://image.tmdb.org/t/p/w300/${movieDetails.poster_path}` : ""}
              className={`max-h-max w-auto  ${isMobile ? 'mb-' : ''}`}
              alt="Pôster do filme"
            />

            
          </div>
          <div className={`flex-grow w-full ${isMobile ? '' : 'md:w-3/4'} text-mainFontColor`}>
            <h1 className={`text-4xl font-bold mb-4 text-lightGreen ${isMobile ? 'text-center' : 'text-'}`}>
              {movieDetails?.title}{" "}
              {movieDetails?.release_date && (
                <span className="text-gray-500">
                  ({new Date(movieDetails.release_date).getFullYear()})
                </span>
              )}
            </h1>
            <div className="flex items-center  "><p className="text-slate-400 hover:text-lightGreen cursor-pointer transition-all ease-in-out duration-200   mr-5">Avaliar filme</p>
            <button
         className="bg-constrastColor text-darkGreen p-3 m-1 text-sm rounded-lg font-semibold max-w-72 font-montserrat hover:brightness-75 transition-all ease-in-out duration-200 shadow-sm shadow-constrastColor"
         onClick={rateMovie}
         >
          Avaliar
    </button>   
    
              <p className="text-slate-400 hover:text-lightGreen cursor-pointer transition-all ease-in-out duration-200   ml-24 mr-5">Adicionar filme a watchlist</p>
              <button
                className="bg-constrastColor text-darkGreen p-3 m-1 text-sm px-4 rounded-lg font-semibold  font-montserrat hover:brightness-75 transition-all ease-in-out duration-200 shadow-sm shadow-constrastColor"
                onClick={addToWatchlist}
              >
                +
              </button>
            </div>
            <div className={`text- text-sm mb-2 mt-6  ${isMobile ? 'text-center' : 'text-'}`}>
              <span className="font-semibold">Classificação indicativa:</span>{" "}
              {movieDetails?.adult ? "18+" : "Livre"}
            </div>
            <div className={`text- text-sm mb-2  ${isMobile ? 'text-center' : 'text-'}`}>
              <span className="font-semibold">Data de lançamento:</span>{" "}
              {movieDetails?.release_date && getReleaseDateFormatted(movieDetails.release_date)}
            </div>
            <div className={`text- text-sm mb-2  ${isMobile ? 'text-center' : 'text-'}`}>
              <span className="font-semibold">País de origem:</span>{" "}
              {movieDetails?.production_countries?.[0]?.name}
            </div>
            <div className={`text- text-sm mb-2  ${isMobile ? 'text-center' : 'text-'}`}>
              <span className="font-semibold">Gênero:</span>{" "}
              {movieDetails?.genres?.map((genre: any) => genre.name).join(", ")}
            </div>

            <div className={`text-lg my-6 ${isMobile ? 'text-center' : ''}`}>
              {movieDetails?.overview}
            </div>
          </div>
        </div>
        
        <div className={`mx-auto text-gray-500 text-xl font-semibold flex ${isMobile ? 'justify-center flex-wrap' : 'justify-center'}`}>
          <button className={`mx-4 my-2 ${selectedOption === 'trailer' ? 'text-lightGreen border-b-2 border-lightGreen' : ''}`} onClick={() => setSelectedOption('trailer')}>Trailer</button>
          <button className={`mx-4 my-2 ${selectedOption === 'cast' ? 'text-lightGreen border-b-2 border-lightGreen' : ''}`} onClick={() => setSelectedOption('cast')}>Elenco</button>
          <button className={`mx-4 my-2 ${selectedOption === 'moreInfo' ? 'text-lightGreen border-b-2 border-lightGreen' : ''}`} onClick={() => setSelectedOption('moreInfo')}>Mais informações</button>
          
        </div>

        {renderSelectedOption()}

        <div>
            <UserReviews reviews={userReviews} />
        </div>
      </div>
    </div>
  );
}
