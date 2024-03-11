import '../styles/global.css'

import { useTMDBApi } from '../api/useTMDBApi';

import { Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "../components/ui/carousel";


import { CiSearch } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from 'react';

import { SideBar } from '../components/sidebar';

interface topMoviesProps {
  id: number,
  title: string,
  overview: string,
  poster_path: string,
  backdrop_path: string
}


export function Home(){
const api = useTMDBApi()
  const [popularMovies, setPopularMovies] = useState<topMoviesProps[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<topMoviesProps[]>([])
  const [nowPlayingMovies, setNowPlayingMovies] = useState<topMoviesProps[]>([])

  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [carouselTopRated, setCarouselTopRated] = useState<CarouselApi>()
  const [carouselNowPlaying, setCarouselNowPlaying] = useState<CarouselApi>()

  const [current, setCurrent] = useState(0)
  const [currentTopRated, setCurrentTopRated] = useState(0)
  const [currentNowPlaying, setCurrentNowPlaying] = useState(0)

  useEffect(()=>{
    async function getPopularMovies(){
      const data = await api.getPopularMovies()
      if(data){
        setPopularMovies(data.movies)
      }
    }

    async function getTopRatedMovies(){
      const data = await api.getTopRatedMovies()
      if(data){
        setTopRatedMovies(data.movies)
      } 
    }

    async function getNowPlaying(){
      const data = await api.getNowPlaying()
      if(data){
        setNowPlayingMovies(data.movies)
      } 
    }
    getNowPlaying()
    getTopRatedMovies()
    getPopularMovies()

    if (!carouselApi) {
      return
    }
    setCurrent(carouselApi.selectedScrollSnap() + 1)
    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1)
    })


    if (!carouselTopRated) {
      return
    }
    setCurrentTopRated(carouselTopRated.selectedScrollSnap() + 1)
    carouselTopRated.on("select", () => {
      setCurrentTopRated(carouselTopRated.selectedScrollSnap() + 1)
    })



    if (!carouselNowPlaying) {
      return
    }
    setCurrentNowPlaying(carouselNowPlaying.selectedScrollSnap() + 1)
    carouselNowPlaying.on("select", () => {
      setCurrentNowPlaying(carouselNowPlaying.selectedScrollSnap() + 1)
    })


  }, [carouselApi, carouselTopRated, carouselNowPlaying])

  function dotCarousel(i: number){
    if (!carouselTopRated) {
      return
    }
    carouselTopRated.scrollTo(currentTopRated+i)
  }

  function dotCarouselNowPlaying(i: number){
    if (!carouselNowPlaying) {
      return
    }
    carouselNowPlaying.scrollTo(currentNowPlaying+i)
  }
  
  return(
    <div className="bg-mainBg min-h-screen font-playfair min-w-full flex">
      <SideBar/>
      <div className='flex-initial w-94vw'>
          <div className='flex sm:justify-around items-center h-20 justify-center bg-bgAside w-screen  md:w-full'>
            
            <h1 className='font-semibold text-5xl text-constrastColor'>Kiwi</h1>

            <div className='items-center relative hidden md:flex'>
              <input className='bg-darkGreen h-8 w-52 rounded-full pl-3 outline-none font-montserrat text-white' type="text" placeholder='...'/>
              <p className='text-3xl absolute right-2 text-lightGreen'><CiSearch/></p>
            </div>
          </div>
        
          <div className='w-screen md:w-full pt-8 flex flex-wrap justify-center lg:gap-5 bg-bgAside'>
            <div className='max-w-96 text-mainFontColor text-center flex flex-col gap-7 items-center md:p-5 py-3 sm:py-0'>
              <h1 className='font-medium text-4xl mt-6 font-montserrat2'>Seja bem vindo ao Kiwi</h1>
              <p className='font-montserrat2 font-light'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, similique.</p>
              <button className='bg-constrastColor text-darkGreen p-4 rounded-lg font-semibold max-w-72 font-montserrat hover:brightness-75 transition-all ease-in-out duration-200 '>Faça login ou cadastre-se</button>
            </div>
            <Carousel opts={{
              loop: true  
            }}
            setApi={setCarouselApi}
              className='max-w-700px text-slate-50 hidden lg:block '>
                <CarouselContent className='w-full '>
                {popularMovies.map((movie, index) =>{
                  
                  if(current-1 == index){
                    return(
                      <CarouselItem key={movie.id} className='basis-1/3 h-80 flex justify-center '>
                        <img className='transition-all' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                      </CarouselItem> 
                    )
                  }else{
                    return(
                      <CarouselItem key={movie.id} className='basis-1/3 h-80 flex items-center justify-center '>
                        <img className='h-64' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                      </CarouselItem> 
                    )
                  }
                  
                })}
              </CarouselContent>
            </Carousel>
          </div>
        <div className='w-full font-montserrat py-5 p-0 sm:p-5'>
          <h1 className='text-constrastColor text-2xl font-semibold px-3 sm:px-0'>AS MELHORES AVALIAÇÕES</h1>
          <Carousel className='w-full flex gap-3 mt-5' opts={{dragFree: true}} setApi={setCarouselTopRated}>
            <CarouselContent className='flex '>
              {topRatedMovies.map(movie =>{
                return(
                  <CarouselItem key={movie.id} className='basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex justify-end sm:justify-normal'>
                    <div className='cursor-pointer hover:brightness-50 transition-all ease-in-out duration-200'>
                      <img className='h-64 sm:h-80 object-cover' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <button className='text-gray-300 text-5xl hidden sm:block' onClick={()=>dotCarousel(3)}><IoIosArrowForward/></button>
          </Carousel>
        </div>
        <div className='w-full font-montserrat py-5 p-0 sm:p-5'>
          <h1 className='text-constrastColor text-2xl font-semibold px-3 sm:px-0'>FILMES EM CARTAZ</h1>
          <Carousel className='w-full flex gap-3 mt-5' opts={{dragFree: true}} setApi={setCarouselNowPlaying}>
            <CarouselContent className='flex'>
              {nowPlayingMovies.map(movie =>{
                return(
                  <CarouselItem key={movie.id} className='basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex justify-end sm:justify-normal'>
                    <div className='cursor-pointer hover:brightness-50 transition-all ease-in-out duration-200'>
                      <img className='h-64 sm:h-80 object-cover' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <button className='text-gray-300 text-5xl hidden sm:block' onClick={()=>dotCarouselNowPlaying(3)}><IoIosArrowForward/></button>
          </Carousel>
        </div>
      </div>
    </div>
  )
}