import "../styles/global.css";

import { useTMDBApi } from "../api/useTMDBApi";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../components/ui/carousel";

import { Skeleton } from "@/components/ui/skeleton";

import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import { useContext, useEffect, useState } from "react";

import { SideBar } from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { LoginContext } from "@/context/AuthContext";
import { Header } from "@/components/header";

interface moviesProps {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
}

/*interface genresProps {
  id: number,
  name: string
}*/

export function Home() {
  const api = useTMDBApi();
  const navigate = useNavigate();

  const [popularMovies, setPopularMovies] = useState<moviesProps[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<moviesProps[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<moviesProps[]>([]);
  //const [genres, setGenres] = useState<genresProps[]>([])

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [carouselTopRated, setCarouselTopRated] = useState<CarouselApi>();
  const [carouselNowPlaying, setCarouselNowPlaying] = useState<CarouselApi>();

  const [current, setCurrent] = useState(0);
  const [currentTopRated, setCurrentTopRated] = useState(0);
  const [currentNowPlaying, setCurrentNowPlaying] = useState(0);

  const authContext = useContext(LoginContext);

  function goToPage(page: string){
    navigate(page)
    window.scrollTo({ top: 0})
  }

  useEffect(() => {
    //CHAMADA API DE FILME
    async function getPopularMovies() {
      const data = await api.getPopularMovies("1");
      if (data) {
        setPopularMovies(data.movies);
      }
    }

    async function getTopRatedMovies() {
      const data = await api.getTopRatedMovies();
      if (data) {
        setTopRatedMovies(data.movies);
      }
    }

    async function getNowPlaying() {
      const data = await api.getNowPlaying();
      if (data) {
        setNowPlayingMovies(data.movies);
      }
    }

    /*async function getGenres(){
      const data = await api.getAllGenres()
      if(data){
        setGenres(data.genres)
      } 
    }

    getGenres()*/
    getNowPlaying();
    getTopRatedMovies();
    getPopularMovies();
    ////////////////////////////////

    if (!carouselApi) {
      return;
    }
    setCurrent(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });

    if (!carouselTopRated) {
      return;
    }
    setCurrentTopRated(carouselTopRated.selectedScrollSnap() + 1);
    carouselTopRated.on("select", () => {
      setCurrentTopRated(carouselTopRated.selectedScrollSnap() + 1);
    });

    if (!carouselNowPlaying) {
      return;
    }
    setCurrentNowPlaying(carouselNowPlaying.selectedScrollSnap() + 1);
    carouselNowPlaying.on("select", () => {
      setCurrentNowPlaying(carouselNowPlaying.selectedScrollSnap() + 1);
    });
  }, [carouselApi, carouselTopRated, carouselNowPlaying]);

  function dotCarousel(i: number) {
    if (!carouselTopRated) {
      return;
    }
    carouselTopRated.scrollTo(currentTopRated + i);
  }

  function dotCarouselNowPlaying(i: number) {
    if (!carouselNowPlaying) {
      return;
    }
    carouselNowPlaying.scrollTo(currentNowPlaying + i);
  }

  return (
    <div className="flex">
      <SideBar />
      <div className="dark:bg-black bg-mainBg flex-initial w-full min-h-screen pb-11">
        <Header />

        <div className="w-full pt-8 flex flex-wrap justify-around gap-5 bg-bgAside dark:bg-black ">
          <div className="max-w-96 text-mainFontColor text-center flex flex-col gap-7 items-center dark:text-white">
            <h1 className="font-medium text-4xl mt-6 font-montserrat2">
              Seja bem vindo ao Kiwi
            </h1>
            <p className="font-montserrat font-light mobile:mb-10">
              Explore catálogos, crie watchlists e compartilhe suas opiniões e
              ideias com a comunidade.
            </p>
            {authContext.user ? null : (

              <button
                onClick={() => navigate("Login")}
                className="bg-constrastColor text-darkGreen p-4 rounded-lg font-semibold max-w-72 font-montserrat hover:brightness-75 transition-all ease-in-out duration-200 shadow-sm shadow-constrastColor dark:text-white dark:bg-black dark:shadow-white dark:border-white dark:border-2"
              >
                Faça login ou cadastre-se
              </button>
            )}
          </div>
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              
              }),
            ]}
            setApi={setCarouselApi}
            className="max-w-700px text-slate-50 block xs:hidden tablet:hidden mobile:hidden"
          >
            <CarouselContent className="w-full ">
              {popularMovies.length > 0 ? (
                popularMovies.map((movie, index) => {
                  if (current - 1 == index) {
                    return (
                      <CarouselItem
                        key={movie.id}
                      
                        className="basis-1/3 h-80 flex justify-center "
                      >  
                      <img className="transition-all" onClick={()=>goToPage(`/movie/${movie.id}`)} src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`Cartaz de ${movie.title}`} />
                      </CarouselItem>
                    );
                  } else {
                    return (
                      <CarouselItem
                        key={movie.id}
                        className="basis-1/3 h-80 flex items-center justify-center "
                      > 
                        <img
                          className="h-64"
                          onClick={()=>goToPage(`/movie/${movie.id}`)}
                          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                          alt={`Cartaz de ${movie.title}`}
                        />
                      </CarouselItem>
                    );
                  }
                })
              ) : (
                <div className="flex items-center gap-6">
                  <Skeleton className="bg-zinc-500 h-64 w-48 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-52 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-64 w-48 rounded-none" />
                </div>
              )}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="w-full font-montserrat py-6 px-12">
          <h1 className="text-constrastColor text-2xl font-semibold dark:text-yellow-300">
            MELHORES AVALIAÇÕES
          </h1>
          <Carousel
            className="w-full flex gap-3 mt-5 group"
            opts={{ dragFree: true }}
            setApi={setCarouselTopRated}
          >
            <CarouselContent className="flex ">
              {topRatedMovies.length > 0 ? (
                topRatedMovies.map((movie) => {
                  return (
                    <CarouselItem
                      key={movie.id}
                      className="max:basis-1/7 xl:basis-1/6 2xl:basis-1/6 lg:basis-1/5 md:basis-1/4 sm:basis-1/4 xs:basis-1/3 tablet:basis-1/3 mobile:basis-1/2"
                    >
                      <div className="cursor-pointer hover:brightness-50 transition-all ease-in-out duration-200">
                        {topRatedMovies.length > 0 ? (
                          <img className="max:h-96 2xl:h-72 xl:h-64 lg:h-64 sm:h-64 xs:h-64 tablet:h-64 mobile:h-52 object-cover" onClick={()=>goToPage(`/movie/${movie.id}`)} src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`Cartaz de ${movie.title}`} />
                        ) : (
                          <Skeleton className="h-6 w-10" />
                        )}
                      </div>
                    </CarouselItem>
                  );
                })
              ) : (
                <div className="flex gap-4">
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none " />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" /> 
                </div>
              )}
            </CarouselContent>
            <button
              className="text-gray-300 text-5xl hidden absolute left-0 hover:bg-mainBgOpacity75 h-full transition-all ease-in-out duration-200 group-hover:block dark:hover:bg-opacity-75 dark:hover:bg-black"
              onClick={() => dotCarousel(-5)}
            >
              <IoIosArrowBack />
            </button>
            <button
              className="text-gray-300 text-5xl hidden absolute right-0 hover:bg-mainBgOpacity75 h-full transition-all ease-in-out duration-200 group-hover:block dark:hover:bg-opacity-75 dark:hover:bg-black"
              onClick={() => dotCarousel(3)}
            >
              <IoIosArrowForward />
            </button>
          </Carousel>
        </div>
        <div className="w-full font-montserrat py-6 p-12">
          <h1 className="text-constrastColor text-2xl font-semibold dark:text-yellow-300">
          FILMES EM CARTAZ
          </h1>
          <Carousel
            className="w-full flex gap-3 mt-5 group"
            opts={{ dragFree: true }}
            setApi={setCarouselNowPlaying}
          >
            <CarouselContent className="flex">
              {nowPlayingMovies.length > 0 ? (
                nowPlayingMovies.map((movie) => (
                  <CarouselItem key={movie.id} className="max:basis-1/7 xl:basis-1/6 2xl:basis-1/6 lg:basis-1/5 md:basis-1/4 sm:basis-1/4 xs:basis-1/3 tablet:basis-1/3 mobile:basis-1/2">
                    <div className="cursor-pointer hover:brightness-50 transition-all ease-in-out duration-200">
                      <img className="max:h-96 2xl:h-72 xl:h-64 lg:h-64 sm:h-64 xs:h-64 tablet:h-64 mobile:h-52 object-cover" onClick={()=>goToPage(`/movie/${movie.id}`)} src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`Cartaz de ${movie.title}`} />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <div className="flex gap-4">
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                  <Skeleton className="bg-zinc-500 h-80 w-48 max:h-80 2xl:h-80 xl:h-80 lg:h-72 sm:h-64 xs:h-64 tablet:h-64 mobile:h-56 rounded-none" />
                </div>
              )}
            </CarouselContent>
            <button
              className="text-gray-300 text-5xl hidden absolute left-0 hover:bg-mainBgOpacity75 dark:hover:bg-opacity-75 dark:hover:bg-black h-full transition-all ease-in-out duration-200 group-hover:block"
              onClick={() => dotCarouselNowPlaying(-5)}
            >
              <IoIosArrowBack />
            </button>
            <button
              className="text-gray-300 text-5xl hidden absolute right-0 hover:bg-mainBgOpacity75 dark:hover:bg-opacity-75 dark:hover:bg-black h-full transition-all ease-in-out duration-200 group-hover:block"
              onClick={() => dotCarouselNowPlaying(3)}
            >
              <IoIosArrowForward />
            </button>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
