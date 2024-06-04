import { useTMDBApi } from "@/api/useTMDBApi";
import { Header } from "@/components/header";
import { SideBar } from "@/components/sidebar";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { CiSearch } from "react-icons/ci";

import { Link } from "react-router-dom";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../components/ui/carousel";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,

} from "@/components/ui/pagination"

import { useSearchParams } from "react-router-dom";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"


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

  const [current, setCurrent] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const [searchParams, setSearchParams] = useSearchParams()
  const genre = searchParams.get('genre')
  const page = searchParams.get('page')
  const currentPage = Number(page)

  useEffect(()=>{
    async function getGenres(){
      const data = await api.getAllGenres()
      if(data){
        setGenres(data.genres)
      }
    }
    
    getGenres()
    if(page && !genre) filterByGenre("", page)
    if(page && genre) filterByGenre(genre, page)

    if (!carouselApi) {
      return;
    }
    setCurrent(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
    
  }, [])

  function dotCarousel(i: number) {
    console.log(current)

    if (!carouselApi) {
      return;
    }
    carouselApi.scrollTo(current + i);
  }

  async function filterByGenre(genreId?: string, pageId?: string){
    setSearchParams(state => {
      if(genreId){
        if(genreId == genre && pageId == page){
          state.delete('genre')
        } else {
          state.set('genre', genreId)
        }
      } else{
        state.delete('genre')
      }
      return state
    })

    setSearchParams(state => {
      if(pageId){
        state.set('page', pageId)
      } 
      return state
    })

    if(pageId && genreId){
      if(genreId == genre && page == pageId){
        const data = await api.getMoviesByGenre("", pageId)
        if(data){
          setPopularMovies(data.movies)
        }
      }else {
        const data = await api.getMoviesByGenre(genreId, pageId)
        if(data){
          setPopularMovies(data.movies)
        }
      }
    } else if(pageId && !genreId){
      const data = await api.getMoviesByGenre("", pageId)
      if(data){
        setPopularMovies(data.movies)
      }
    }
  }

  async function searchMovie(){
    const inputSearch = document.getElementById("inputSearch") as HTMLInputElement
    const textInputSearch = inputSearch.value

    if(textInputSearch){
      const data = await api.getMoviesByName(textInputSearch)
      if(data){
        setPopularMovies(data.movies)
      }
    }
  }

  return(
    <div className="flex ">
      <SideBar/>
      <div className='dark:bg-black  bg-mainBg flex-initial w-full min-h-screen'> 
        <Header/>
        <div className="flex items-center flex-col">
         
          <div className="w-full flex flex-col justify-center items-center min-h-28 max-w-full py-6 dark:bg-black dark:border-white dark:text-white bg-bgAside">
            <div className="flex items-center mb-6">

              <p className="text-slate-400 text-4xl flex items-center relative left-10"><CiSearch/></p>
              <input type="text" id="inputSearch" onChange={searchMovie} className="w-[500px] h-12   bg-slate-900 border-2 dark:bg-black dark:border-white dark:text-white text-slate-400 border-slate-400 rounded-md px-10  outline-none focus:border-constrastColor dark:focus:border-yellow-400" placeholder="Procurar filmes"/>
            </div>
          
            <div className="w-full flex justify-center items-center gap-2 flex-wrap text-slate-400 relative dark:bg-black  ">
              <Carousel className="w-full max-w-5xl flex items-center" opts={{ dragFree: true }} setApi={setCarouselApi}>
                <ToggleGroup className="w-full max-w-5xl flex items-center " type="single">
                  <CarouselContent>
                    {genres.map(genre =>{
                      return(
                        <CarouselItem key={genre.id} className="basis-1/7">
                          <div
                          className="border-2 border-slate-400 bg-slate-900  dark:bg-black dark:border-white  flex dark:text-white justify-center rounded-md hover:border-constrastColor transition-all duration-300 cursor-pointer min-w-[137px] "
                          onClick={()=>filterByGenre(String(genre.id), String(page))}
                          >
                            <ToggleGroupItem className="h-full w-full rounded-sm p-1 dark:hover:text-white dark:hover:bg-gray-900" value={String(genre.id)}>{genre.name}</ToggleGroupItem>
                          </div>
                        </CarouselItem>
                      )
                    })}

                  </CarouselContent>
                </ToggleGroup>

                <button onClick={()=>dotCarousel(-5)} className="text-gray-300 text-3xl absolute -left-10 hover:bg-mainBgOpacity75 h-full transition-all ease-in-out duration-200 group-hover:block dark:bg-black dark:text-white dark:hover:bg-black">
                  <IoIosArrowBack />
                </button>
                <button onClick={()=>dotCarousel(+4)}  className="text-gray-300 text-3xl absolute -right-10 hover:bg-mainBgOpacity75 h-full transition-all ease-in-out duration-200 group-hover:block dark:bg-black dark:text-white">
                  <IoIosArrowForward />
                </button>
              </Carousel>
            </div>
          </div>

          <div className="h-[1px] bg-slate-400 w-11/12 "></div>

          <div className="flex justify-center mt-6 gap-3 flex-wrap dark:hover:text-white ">
          {popularMovies.map(movie => {
            return (
             <div key={movie.id} className="cursor-pointer hover:brightness-50 transition-all ease-in-out duration-200 ">
                <Link to={`/movie/${movie.id}`}>
                  <img className="h-80" src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt= {movie.title}/>
                </Link>
              </div>
            );
          })}
          </div>
          <Pagination className="my-16 ">
            <PaginationContent className="text-white dark:bg-black dark:text-white ">
              {currentPage>=2?
                <PaginationItem>
                  <PaginationPrevious className="cursor-pointer dark:bg-black dark:text-white " onClick={()=>{
                    {genre?
                      filterByGenre(genre, String(currentPage-1))
                    :
                      filterByGenre("",`${currentPage-1}`)
                    }
                    window.scrollTo({
                      top: 0
                    })
                    }}>
                    Anterior
                  </PaginationPrevious>
                </PaginationItem>
              :null
              }
              
              {currentPage==1?
                <div className="flex gap-1 dark:bg-black dark:text-white ">

                  <PaginationItem >
                    <PaginationLink className="text-black dark:bg-black dark:text-white " onClick={()=>{
                      {genre?
                        filterByGenre(genre, String(currentPage))
                      :
                        filterByGenre("",`${currentPage}`)
                      }
                      window.scrollTo({
                        top: 0
                      })
                    }} isActive>{currentPage}</PaginationLink>
                  </PaginationItem>

                  <PaginationItem >
                    <PaginationLink className="hover:cursor-pointer dark:bg-black dark:text-white " onClick={()=>{
                      {genre?
                        filterByGenre(genre, String(currentPage+1))
                      :
                        filterByGenre("",`${currentPage+1}`)
                      }
                      window.scrollTo({
                        top: 0
                      })
                    }} >{currentPage+1}</PaginationLink>
                  </PaginationItem>

                  <PaginationItem >
                    <PaginationLink className="hover:cursor-pointer" onClick={()=>{
                      {genre?
                        filterByGenre(genre, String(currentPage+2))
                      :
                        filterByGenre("",`${currentPage+2}`)
                      }
                      window.scrollTo({
                        top: 0
                      })
                    }} >{currentPage+2}</PaginationLink>
                  </PaginationItem>
                </div>
              :
                <div className="flex gap-1">
                  
                  {currentPage==500?
                  
                    <div className="flex gap-1">
                      <PaginationItem>
                        <PaginationLink className="cursor-pointer" onClick={()=>{
                          {genre?
                            filterByGenre(genre, String(currentPage-2))
                          :
                            filterByGenre("",`${currentPage-2}`)
                          }
                          window.scrollTo({
                            top: 0
                          })
                        }}>{currentPage-2}</PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink className="cursor-pointer" onClick={()=>{
                          {genre?
                            filterByGenre(genre, String(currentPage-1))
                          :
                            filterByGenre("",`${currentPage-1}`)
                          }
                          window.scrollTo({
                            top: 0
                          })
                        }}>{currentPage-1}</PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink className="text-black cursor-pointer " onClick={()=>{
                          {genre?
                            filterByGenre(genre, String(currentPage))
                          :
                            filterByGenre("",`${currentPage}`)
                          }
                          window.scrollTo({
                            top: 0
                          })
                          }} isActive>{currentPage}</PaginationLink>
                      </PaginationItem>

                      
                    </div>
                  :
                    <div className="flex gap-1">
                      <PaginationItem >
                        <PaginationLink className="cursor-pointer" onClick={()=>{
                          {genre?
                            filterByGenre(genre, String(currentPage-1))
                          :
                            filterByGenre("",`${currentPage-1}`)
                          }
                          window.scrollTo({
                            top: 0
                          })
                        }}>{currentPage-1}</PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink className="text-black cursor-pointer dark:bg-black dark:text-white" onClick={()=>{
                          {genre?
                            filterByGenre(genre, String(currentPage))
                          :
                            filterByGenre("",`${currentPage}`)
                          }
                          window.scrollTo({
                            top: 0
                          })
                          }} isActive>{currentPage}</PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink className="cursor-pointer" onClick={()=>{
                          {genre?
                            filterByGenre(genre, String(currentPage+1))
                          :
                            filterByGenre("",`${currentPage+1}`)
                          }
                          window.scrollTo({
                            top: 0
                          })
                        }} >{currentPage+1}</PaginationLink>
                      </PaginationItem>
                    </div> 
                  }
                </div>
              }
              
              {currentPage!=500?
                <PaginationItem>
                  <PaginationNext className="cursor-pointer" onClick={()=>{
                    {genre?
                      filterByGenre(genre, String(currentPage+1))

                    :
                      filterByGenre("",`${currentPage+1}`)
                    }
                    window.scrollTo({
                      top: 0
                    })
                    }} />
                </PaginationItem>
                :null
              }
              
            </PaginationContent>
          </Pagination>

        </div>
      </div>
    </div>
  )
}