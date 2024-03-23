import { useTMDBApi } from "@/api/useTMDBApi";
import { Header } from "@/components/header";
import { SideBar } from "@/components/sidebar";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import { useSearchParams } from "react-router-dom";

interface genresProps {
  id: number,
  name: string
}

interface moviesProps {
  id: number,
  title: string,
  overview: string,
  poster_path: string,
  backdrop_path: string
}

export function Movies(){

  const api = useTMDBApi()

  const [genres, setGenres] = useState<genresProps[]>([])
  const [popularMovies, setPopularMovies] = useState<moviesProps[]>([])
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page')

  useEffect(()=>{
    async function getGenres(){
      const data = await api.getAllGenres()
      if(data){
        setGenres(data.genres)
      }
    }
    async function getPopularMovies(){
      const data = await api.getPopularMovies()
      if(data){
        setPopularMovies(data.movies)
      }
    }
    getGenres()
    getPopularMovies()


    
  }, [])
  function onLoadParams(){
    setSearchParams(state => {
      state.set('page', String(1))

      return state
    })
  }

  function nextPage(){
    if(!page) return

    const nextPageNumber = Number(page)+1
    setSearchParams(state => {
      state.set('page', String(nextPageNumber))

      return state
    })
  }

  return(
    <div className="flex" onLoad={onLoadParams}>
      <SideBar/>
      <div className='bg-mainBg flex-initial w-full min-h-screen'>
        <Header/>
        <div className="flex items-center flex-col">
          {/*<div className="bg-bgAside flex-none w-80 h-[570px] flex flex-col justify-center items-center">
            <input type="text" placeholder="Procurar filmes" className="text-slate-400 w-5/6 h-9 pl-2 rounded-sm bg-slate-900 border-2 border-slate-400 mb-10 focus:border-constrastColor outline-none"/>
            <div className="flex flex-wrap text-slate-400 gap-3 justify-center">
              {
                genres.map(genre =>{
                  return(
                    <div className="bg-slate-900 border-2 border-slate-400 py-1 px-4 rounded-sm hover:border-constrastColor" key={genre.id}>{genre.name}</div>
                  )
                })
              }
            </div>
          </div>

          <div className="flex gap-3 flex-wrap p-5">
            {popularMovies.map(movie =>{
              return(
                <div key={movie.id}>
                  <img className="h-80" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                </div>
              )
            })}
          </div>*/}

          <div className="w-full flex flex-col justify-center items-center min-h-28 max-w-full py-6 bg-bgAside">
            <input type="text" className="w-[500px] h-12 bg-slate-900 border-2 border-slate-400 rounded-md pl-4 mb-6 outline-none focus:border-constrastColor" placeholder="Procurar filmes"/>
          
            <div className="w-full flex justify-center items-center gap-2 flex-wrap text-slate-400 relative">
              <Carousel className="w-full max-w-5xl flex items-center" opts={{ dragFree: true }}>
                <CarouselContent>
                  {genres.map(genre =>{
                    return(
                      <CarouselItem key={genre.id} className="basis-1/7">
                        <div className="p-1 border-2 border-slate-400 bg-slate-900 flex justify-center rounded-md hover:border-constrastColor">
                          {genre.name}
                        </div>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
                <button className="text-gray-300 text-3xl absolute -left-10 hover:bg-mainBgOpacity75 h-full transition-all ease-in-out duration-200 group-hover:block">
                  <IoIosArrowBack />
                </button>
                <button className="text-gray-300 text-3xl absolute -right-10 hover:bg-mainBgOpacity75 h-full transition-all ease-in-out duration-200 group-hover:block">
                  <IoIosArrowForward />
                </button>
              </Carousel>
            </div>
          </div>

          <div className="h-[1px] bg-slate-400 w-11/12"></div>

          <div className="flex justify-center mt-6 gap-3 flex-wrap ">
            {popularMovies.map(movie =>{
              return(
                <div key={movie.id}>
                  <img className="h-80" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                </div>
              )
            })}
          </div>
          <button onClick={nextPage}>Next</button>

        </div>
      </div>
    </div>
  )
}