//import './styles/Home.scss'
import './styles/global.css'

import { useApi } from './api/useApi';

import { Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "./components/ui/carousel";

import Autoplay from "embla-carousel-autoplay"

import { GoGear } from "react-icons/go";
import { FaSearch, FaListUl, FaRegStar } from "react-icons/fa";
import { PiHouseBold } from "react-icons/pi";
import { useEffect, useState } from 'react';

interface topMoviesProps {
  id: number,
  title: string,
  overview: string,
  poster_path: string,
  backdrop_path: string
}

interface seriesProps {
  id: number,
  original_name: string,
  overview: string,
  poster_path: string,
  backdrop_path: string
}

function App() {
  const api = useApi()
  const [topMovies, setTopMovies] = useState<topMoviesProps[]>([])
  const [discoverMovies, setDiscoverMovies] = useState<topMoviesProps[]>([])
  const [popularSeries, setPopularSeries] = useState<seriesProps[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<topMoviesProps[]>([])
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(()=>{
    async function getTopMovies(){
      const data = await api.topMovies()
      if(data){
        setTopMovies(data.movies)
      } 
    }

    async function getDiscoverMovies(){
      const data = await api.discoverMovies()
      if(data){
        setDiscoverMovies(data.movies)
      } 
    }
    async function getPopularSeries(){
      const data = await api.popularSeries()
      if(data){
        setPopularSeries(data.series)
      } 
    }
    async function getUpcomingMovies(){
      const data = await api.upcoming()
      if(data){
        setUpcomingMovies(data.movies)
      } 
    }
    getUpcomingMovies()
    getPopularSeries()
    getTopMovies()
    getDiscoverMovies()

    if (!carouselApi) {
      return
    }

    setCurrent(carouselApi.selectedScrollSnap() + 1)

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1)
    })

  
  }, [carouselApi])
  function dotCarousel(i: number){
    if (!carouselApi) {
      return
    }
    carouselApi.scrollTo(i)
  }
  return(
    <div className="bg-mainBg min-h-screen flex font-poppins">
      <div className="text-mainFontColor flex justify-around items-center flex-1 max-w-28 pl-4 sticky top-0 h-screen">
        <div className="min-h-screen flex flex-col justify-center items-center gap-11 text-2xl ">
          <p className='cursor-pointer hover:brightness-50 transition-all'><FaSearch/></p>
          <p className='bg-selectColor w-10 h-10 rounded-lg text-mainFontColor flex justify-center items-center cursor-pointer transition-all'><PiHouseBold/></p>
          <p className='cursor-pointer hover:brightness-50 transition-all'><FaListUl/></p>
          <p className='cursor-pointer hover:brightness-50 transition-all'><FaRegStar/></p>
          <p className='cursor-pointer hover:brightness-50 transition-all'><GoGear/></p>
        </div>
        <div className="h-4/5 w-px bg-mainFontColor opacity-5"></div>
      </div>
      <div className="flex-auto p-3 w-96">
        <h1 className='font-semibold text-5xl flex justify-center items-center h-20 text-mainFontColor'>LOGO</h1>
        <Carousel className='w-full'
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          setApi={setCarouselApi}
        >
          <CarouselContent className='w-full pl-4'>
          {topMovies.map(movie => {
            return(
              <CarouselItem className='relative h-96' key={movie.id}>
                <div className='bg-gradient-to-r from-mainBg from-20% absolute bottom-0 h-full p-5 flex items-center'>
                  <h1 className='text-5xl text-mainFontColor'>
                    <strong>{movie.title}</strong>
                  </h1>
                </div>
                <img className='rounded-xl h-full w-full object-cover' src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt="" />
              </CarouselItem>
            )
          })}
          </CarouselContent>
        </Carousel>
        <div className='flex gap-4 justify-center mt-2'>
          {topMovies.map((movies, index) =>{
            if(current != index+1){
              return(
                <button key={movies.id} onClick={()=>dotCarousel(index)} className='w-2 h-2 bg-mainFontColor rounded-lg opacity-15'></button>
              )
            } else{
              return(
                <button key={movies.id} onClick={()=>dotCarousel(index)} className='w-2 h-2 bg-mainFontColor rounded-lg'></button>
              )
            }
          })}
        </div>

        <div>
          <h1 className='font-semibold text-mainFontColor text-4xl mt-20 pl-4 mb-5'>Top rated movies</h1>
          <Carousel className='w-full'
          opts={{
            loop: true,
            dragFree: true
          }}
          >
            <CarouselContent className='pl-4'>
            {discoverMovies.map(movie => {
              return(
                <CarouselItem className='group relative h-44 basis-1/3 hover:h-90vh transition-height ease-in-out  cursor-pointer  delay-500' key={movie.id}> 
                  <div className='hidden w-96 group-hover:block transition-all ease-in-out delay-500 position absolute left-420px top-52 bg-selectColor p-5 text-mainFontColor rounded-lg max-h-377px overflow-hidden'>
                    <h1 className='font-semibold text-xl mb-3'>{movie.title}</h1>
                    <p>Description:</p>
                    <p className='line-clamp-12'>{movie.overview}</p>
                  </div>
                  <img className='rounded-xl h-full w-full object-cover hover:brightness-50' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                </CarouselItem>
              )
            })}
            </CarouselContent>
          </Carousel>
        </div>

        <div>
          <h1 className='font-semibold text-mainFontColor text-4xl mt-20 pl-4 mb-5'>Popular TV show</h1>
          <Carousel className='w-full'
          opts={{
            loop: true,
            dragFree: true
          }}
          >
            <CarouselContent className='pl-4'>
            {popularSeries.map(movie => {
              return(
                <CarouselItem className='group relative h-44 basis-1/3 hover:h-90vh transition-height ease-in-out  cursor-pointer  delay-500' key={movie.id}> 
                <div className='hidden w-96 group-hover:block transition-all ease-in-out delay-500 position absolute left-420px top-52 bg-selectColor p-5 text-mainFontColor rounded-lg max-h-377px overflow-hidden '>
                  <h1 className='font-semibold text-xl mb-3'>{movie.original_name}</h1>
                  <p>Description:</p>
                  <p className='line-clamp-12'>{movie.overview}</p>
                </div>
                <img className='rounded-xl h-full w-full object-cover hover:brightness-50' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
              </CarouselItem>
              )
            })}
            </CarouselContent>
          </Carousel>
        </div>
        <div>
          <h1 className='font-semibold text-mainFontColor text-4xl mt-20 pl-4 mb-5'>Upcoming</h1>
          <Carousel className='w-full'
          opts={{
            loop: true,
            dragFree: true
          }}
          >
            <CarouselContent className='pl-4'>
            {upcomingMovies.map(movie => {
              return(
                <CarouselItem className='group relative h-44 basis-1/3 hover:h-90vh transition-height ease-in-out  cursor-pointer  delay-500' key={movie.id}> 
                <div className='hidden w-96 group-hover:block transition-all ease-in-out delay-500 position absolute left-420px top-52 bg-selectColor p-5 text-mainFontColor rounded-lg max-h-377px overflow-hidden '>
                  <h1 className='font-semibold text-xl mb-3'>{movie.title}</h1>
                  <p>Description:</p>
                  <p className='line-clamp-12'>{movie.overview}</p>
                </div>
                <img className='rounded-xl h-full w-full object-cover hover:brightness-50' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
              </CarouselItem>
              )
            })}
            </CarouselContent>
          </Carousel>
        </div>
        <div className='text-mainFontColor flex-col flex items-center mt-14'>
          <h1 className='font-semibold text-2xl mb-4'>LOGO</h1>
          <p className='text-slate-400 w-full flex justify-center'>{new Date().getFullYear()} © Logo </p>
        </div>
      </div>
    </div>
  )
}

export default App
