import { useTMDBApi } from '@/api/useTMDBApi';
import { SideBar } from '../components/sidebar';
import homelander from '../images/homelander-1-1.jpg'
import { FormEvent, useContext, useEffect, useState } from 'react';
import { FaLock } from "react-icons/fa";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { LoginContext } from '@/context/AuthContext';

import { Skeleton } from "@/components/ui/skeleton"

import { useNavigate } from 'react-router-dom';

interface topMoviesProps {
    id: number,
    title: string,
    overview: string,
    poster_path: string,
    backdrop_path: string
}

export function Profile(){
    const [popularMovies, setPopularMovies] = useState<topMoviesProps[]>([])
    const [topRatedMovies, setTopRatedMovies] = useState<topMoviesProps[]>([])

    const [profileColor, setProfileColor] = useState('')

    const api = useTMDBApi()
    const authContext = useContext(LoginContext)
    const navigate = useNavigate()

    function isLoged(){
        const storageData = localStorage.getItem('authToken')

        if(!storageData){          
            if(!authContext.user){
                navigate('/')
            }
        }
    }
    isLoged()

    useEffect(()=>{

        function loadProfileColor(){
            const profileColorDiv = document.getElementById('profileColor')
            const username = document.getElementById('username')
            const followers = document.getElementById('followers')

            if(profileColorDiv) profileColorDiv.style.backgroundColor = profileColor
            if(username) username.style.color = profileColor
            if(followers) followers.style.color = profileColor
        }

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
        getTopRatedMovies()
        getPopularMovies()
        loadProfileColor()
    }, [profileColor])


    function selectColor(){
        const labelColor = document.getElementById('labelColor')
        const formColor = document.getElementById('formColor') as HTMLInputElement
        if(!formColor) return
        const color = formColor.value

        if(!labelColor) return;
        labelColor.style.background = color
    }

    function updateProfileColor(e: FormEvent){
        e.preventDefault();
        const formColor = document.getElementById('formColor') as HTMLInputElement
        if(!formColor) return
        const color = formColor.value
        setProfileColor(color)
    }

    return(
        <div className='flex'>
            <SideBar/>
            <div className='bg-mainBg text-emerald-50 w-full min-h-screen font-montserrat'>
                <Dialog>
                    <DialogTrigger className='w-full'>
                        <div
                        className='bg-slate-200 h-80 xs:h-72 tablet:h-72 mobile:h-72
                        flex justify-end items-end p-5 pr-10 hover:brightness-90
                        transition-all ease-in-out duration-200 cursor-pointer w-full' id='profileColor'></div>
                    </DialogTrigger>
                    <DialogContent className='max-w-96 rounded-lg'>
                        <DialogHeader>
                            <DialogTitle>Alterar cor do perfil</DialogTitle>
                            <DialogDescription>
                                Personalize seu perfil como preferir ;)
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <form onSubmit={updateProfileColor}>
                                <label htmlFor="formColor"><p className='w-full h-20 rounded-lg' id='labelColor'></p></label>
                                <input className='w-full h-20 border-0 rounded-lg hidden' onChange={selectColor} type="color" name="formColor" id="formColor" />
                                <button className='bg-white w-full border-2 rounded-lg h-11 mt-4 border-constrastColor hover:brightness-75 transition-all duration-200'>Confirmar</button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>

                
                <div className='p-8 text-slate-200'>
                    <div className='relative -top-40 flex items-center justify-between '>
                        <div className='flex items-center flex-wrap gap-5 '>
                            <img className='h-56 w-48 object-cover border-4 border-mainBg border-b-0' src={homelander} alt="" />
                            <div className='flex flex-col gap-5 mt-5 '>
                                <h1 id='username' className='invert xs:invert-0 tablet:invert-0 mobile:invert-0 text-4xl'>{authContext.user?.name.toLocaleUpperCase()}</h1>
                                <p id='followers' className='font-light invert xs:invert-0 tablet:invert-0 mobile:invert-0'>123 Followers</p>
                                <p className='font-light max-w-80 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et commodi quam fugiat ipsa neque ad facere. Alias enim animi et.</p>
                            </div>
                        </div>
                    </div>
                    <div className='relative -top-28'>
                        {/*<div>
                            <h1 className='flex justify-center text-constrastColor text-2xl font-semibold mb-10'>TOP 3 FILMES DE {authContext.user?.name.toLocaleUpperCase()}</h1>
                            <div className='flex justify-center gap-5 flex-wrap'>
                                <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
                                <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
                                <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
                            </div>
                        </div>*/} 
                        
                        <div className='flex items-center mb-5 justify-between mt-20 mobile:justify-center'>
                            <h1 className='text-constrastColor text-2xl font-semibold'>FILMES FAVORITOS</h1>
                        </div>
                        <div className='flex flex-wrap gap-7 mobile:justify-center'>
                            {popularMovies.length>0?
                                popularMovies.slice(0, 10).map(movie =>{
                                    return(
                                        <div>
                                            <img className='h-80 max:h-[480px] 2xl:h-80 xl:h-[295px] lg:h-56 mobile:h-60' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                                        </div>
                                    )
                                })
                            :
                            <div className='flex flex-wrap gap-4'>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                            </div>
                            }
                        </div>
                        <div className='flex justify-center mt-5 text-lg '><p className='hover:underline cursor-pointer'>Ver todos</p></div>

                        <div className='flex items-center mb-5 justify-between mt-20 mobile:justify-center'>
                            <h1 className='text-constrastColor text-2xl font-semibold'>FILMES AVALIADOS</h1>
                        </div>
                        <div className='flex flex-wrap gap-7 mobile:justify-center'>
                            {topRatedMovies.length>0?
                                topRatedMovies.slice(0, 10).map(movie =>{
                                    return(
                                        <div>
                                            <img className='h-80 max:h-[480px] 2xl:h-80 xl:h-[295px] lg:h-56 mobile:h-60' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" />
                                        </div>
                                    )
                                })
                            :
                            <div className='flex flex-wrap gap-4'>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                                <Skeleton className='h-80 w-56 bg-zinc-500 rounded-none '/>
                            </div>
                            }
                        </div>
                        <div className='flex justify-center mt-5 text-lg '><p className='hover:underline cursor-pointer'>Ver todos</p></div>

                        <div className='mt-20'>
                            <h1 className='text-constrastColor text-2xl font-semibold'>LISTAS DE FILMES A ASSISTIR</h1>
                        </div>
                        <div className='flex gap-10 mt-5 flex-wrap'>
                            <div className='w-64'>
                                <div className='h-10 p-2 text-darkGreen bg-constrastColor flex items-center gap-3'>
                                    <FaLock/>
                                    <h2 className='font-semibold'>Terror</h2>
                                </div>
                                <div className='bg-bgWathcList'>
                                    <ul className='text-blackDefaultColor'>
                                        <li className='p-2 flex items-center gap-2'><input className='accent-darkGreen h-5 w-5 checked:bg-slate-950' type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2 flex items-center gap-2'><input className='accent-slate-500 h-5 w-5 ' type="checkbox" name="" id="" /> aaa</li>
                                        <li className='p-2'> <input type="checkbox" name="" id="" /> aaaaa</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> ss</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                    </ul>
                                </div>
                            </div>
                            <div className='w-64'>
                                <div className='h-10 p-2 bg-darkGreen text-constrastColor flex items-center gap-3'>
                                    <FaLock/>
                                    <h2 className='font-semibold'>Terror</h2>
                                </div>
                                <div className='bg-bgWathcList'>
                                    <ul className='text-blackDefaultColor'>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> aaa</li>
                                        <li className='p-2'> <input type="checkbox" name="" id="" /> aaaaa</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> ss</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>

                                    </ul>
                                </div>
                            </div>
                            <div className='w-64'>
                                <div className='h-10 p-2 bg-darkGreen text-constrastColor flex items-center'>
                                    <FaLock/>
                                </div>
                                <div className='bg-bgWathcList'>
                                    <ul className='text-blackDefaultColor'>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> aaa</li>
                                        <li className='p-2'> <input type="checkbox" name="" id="" /> aaaaa</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> ss</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                    </ul>
                                </div>
                            </div>
                            <div className='w-64'>
                                <div className='h-10 p-2 bg-darkGreen text-constrastColor flex items-center'>
                                    <p className='cursor-pointer'><FaLock/></p>
                                </div>
                                <div className='bg-bgWathcList'>
                                    <ul className='text-blackDefaultColor'>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> aaa</li>
                                        <li className='p-2'> <input type="checkbox" name="" id="" /> aaaaa</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> ss</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                        <li className='p-2'><input type="checkbox" name="" id="" /> a</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center mt-5 text-lg '><p className='hover:underline cursor-pointer'>Ver todos</p></div>

                    </div>
                </div>
            </div>
        </div>
    )
}