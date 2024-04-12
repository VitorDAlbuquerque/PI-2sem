import { useBackendApi } from "@/api/useBackendApi";
import { Header } from "@/components/header";
import { SideBar } from "@/components/sidebar";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page404Error } from "./Page404Error";

import homelander from "../assets/homelander-1-1.jpg";

import { MdEdit } from "react-icons/md";

import { FaRegHeart, FaHeart  } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { LoginContext } from "@/context/AuthContext";

import { BsFillPlusSquareFill } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useTMDBApi } from "@/api/useTMDBApi";

interface watchListProps{
    id: string,
    name: string,
    description: string,
    privacy: boolean,
    authorId: string,
    numberLikes: number,
    user: {
      name: string,
      id: string
    },
    isLiked: [{
        userId: string,
        watchListId: string
    }]
}

interface moviesProps{
    id: string,
    movieName: string,
    movieURLImg: string
}

interface topMoviesProps {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 15));

export function WatchList(){

    const {id} = useParams()
    const apiBackend = useBackendApi()
    const authContext = useContext(LoginContext);
    const apiTMDB = useTMDBApi();
    const navigate = useNavigate();

    const [watchList, setWatchList] = useState<watchListProps>()
    const [movies, setMovies] = useState<moviesProps[]>([])

    const [newMovieAtListDialog, setNewMovieAtListDialog] = useState(false)
    const [editListDialog, setEditListDialog] = useState(false)
    const [deleteListDialog, setDeleteListDialog] = useState(false)

    const [newListMovieValueText, setNewListMovieValueText] = useState('')
    const [newListMovieValueId, setNewListMovieValueId] = useState(Number)
    const [resultNewListMovies, setResultNewListMovies] = useState<topMoviesProps[]>([]);
    const [newListMovieName, setNewListMovieName] = useState('')
    const [newListMovieURL, setNewListMovieURL] = useState('')

    useEffect(()=>{
        async function getWatchListById(){
            if(id){
                const data = await apiBackend.getWatchListById(id)
                if(data){
                    setWatchList(data.watchList)
                }
            }
        }
        getWatchListById()

        async function getMoviesOnWatchList() {
            if(id){
                const data = await apiBackend.getMoviesOnWatchList(id)
                if(data){
                    setMovies(data.moviesOnWatchList)
                }
            }
        }
        getMoviesOnWatchList()
    }, [newMovieAtListDialog, editListDialog, watchList, deleteListDialog])

    if(!watchList){
        return <Page404Error/>
    } 
    
    function onBlurInputList(){
        const divResult = document.getElementById('result')
        if(divResult){
          divResult.style.display = 'none'
        }
    }

    async function getMoviesByName(){
        const data = await apiTMDB.getMoviesByName(newListMovieValueText)
        const divResult = document.getElementById('result')
        if(data){
          setResultNewListMovies(data.movies)
          if(divResult){
            divResult.style.display = 'block'
          }
        }
    }

    async function addMovieAtList(e: FormEvent){
        e.preventDefault();
        wait().then(() => setNewMovieAtListDialog(false));
        const storageData = localStorage.getItem("authToken");
        if (storageData && watchList) {
            await apiBackend.addMoviesWatchList(storageData, watchList.id, newListMovieValueId, newListMovieName, newListMovieURL)
        }
    }

    async function editWatchlist(e: FormEvent) {
        e.preventDefault();
        wait().then(() => setEditListDialog(false));
    
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        const storageData = localStorage.getItem("authToken");
        if (storageData ) {
            await apiBackend.editWatchList(storageData, data.id as string, data.name as string, data.description as string, Boolean(data.privacy));
        }
    }

    async function deleteWatchList(idwl: string){
        const storageData = localStorage.getItem("authToken");
        if(storageData){
            await apiBackend.deleteWatchlist(storageData, idwl)
        }
    }

    async function newLike(){
        const storageData = localStorage.getItem("authToken");
        if (storageData && id) {
            await apiBackend.newLike(storageData, id);
        }
    }

    return(
        <div className="flex">
            <SideBar />
            <div className="bg-mainBg flex-initial w-full min-h-screen">
                <Header />
                <div className="p-10">
                    <h1 className="text-constrastColor font-semibold text-2xl flex gap-10 items-center mb-3">Lista: {watchList?.name}
                        {watchList.authorId==authContext.user?.id?
                            <div className="flex items-center gap-4 ">
                                <Dialog open={newMovieAtListDialog} onOpenChange={setNewMovieAtListDialog}>
                                    <DialogTrigger>
                                        <p className="hover:brightness-75 transition-all ease-in-out duration-200 cursor-pointer"><BsFillPlusSquareFill/></p>
                                    </DialogTrigger>
                                    <DialogContent onClick={onBlurInputList} className="max-w-96 rounded-lg text-left">
                                        <DialogHeader>
                                            <DialogTitle>Adicionar novos filmes</DialogTitle>
                                            <DialogDescription>
                                                Adicione filmes e expanda sua lista!
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div>
                                            <form onSubmit={addMovieAtList} className="text-sm text-slate-500 flex flex-col gap-4">
                                                <div>
                                                    <p>Selecione o filme</p>
                                                    <input value={newListMovieValueText} onChange={(e)=>{
                                                    setNewListMovieValueText(e.target.value)
                                                    getMoviesByName()
                                                    }}
                                                
                                                    className="group w-full h-10 border-[1px] outline-none border-slate-500 rounded-md px-2" type="text" />
                                                    <div id="result" className="bg-white hidden w-[87.5%] border-[1px] outline-none border-slate-500 rounded-md absolute">
                                                    {resultNewListMovies.slice(0, 5).map(result =>{
                                                        return(
                                                        <p key={result.id} onClick={()=>{
                                                            setNewListMovieValueText(result.title)
                                                            setNewListMovieValueId(result.id)
                                                            setNewListMovieName(result.title)
                                                            setNewListMovieURL(result.poster_path)   
                                                        }} className="py-1 px-2 hover:bg-slate-400 hover:text-white cursor-pointer transition-all ease-in-out duration-200">{result.title}</p>
                                                        )
                                                    })}
                                                    
                                                    </div>
                                                </div>
                        
                                                <div className="flex items-center justify-end gap-5 ">
                                                    <DialogClose onClick={()=>{
                                                        setNewListMovieValueText("")
                                                    }} className="bg-gray-300 w-20 p-2 rounded-lg hover:brightness-75 transition-all duration-200">
                                                    Cancelar
                                                    </DialogClose>
                            
                                                    <button onClick={()=>setNewListMovieValueText("")} className="border-2 w-20 bg-white border-constrastColor p-2 rounded-lg hover:brightness-90 transition-all duration-200">
                                                        Adicionar
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={editListDialog} onOpenChange={setEditListDialog}>
                                    <DialogTrigger>
                                        <p className="hover:brightness-75 hover:bg-darkGreen rounded-sm transition-all ease-in-out duration-200 cursor-pointer"><MdEdit/></p>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-96 rounded-lg text-left">
                                        <DialogHeader>
                                            <DialogTitle>Editar lista</DialogTitle>
                                            <DialogDescription>
                                                Altere a lista como desejar!
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div>
                                            <form onSubmit={editWatchlist} className="text-sm text-slate-500 flex flex-col gap-4">
                                                <input name="id" defaultValue={watchList.id} type="hidden" />

                                                <div>
                                                    <p>Título</p>
                                                    <input name="name" defaultValue={watchList.name} className="w-full h-10 border-[1px] outline-none border-slate-500 rounded-md px-2" type="text" />
                                                </div>
                                                <div>
                                                    <p>Descrição</p>
                                                    <textarea name="description" defaultValue={watchList.description} className="w-full min-h-10 border-[1px] outline-none border-slate-500 rounded-md px-2 py-2" rows={5}></textarea>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input name="privacy" defaultChecked={watchList.privacy} type="checkbox" />
                                                    <p>Lista privada</p>
                                                </div>
                        
                                                <div className="flex items-center justify-end gap-5 ">
                                                    <DialogClose onClick={()=>{
                                                        setNewListMovieValueText("")
                                                    }} className="bg-gray-300 w-20 p-2 rounded-lg hover:brightness-75 transition-all duration-200">
                                                    Cancelar
                                                    </DialogClose>
                            
                                                    <button className="border-2 w-20 bg-white border-constrastColor p-2 rounded-lg hover:brightness-90 transition-all duration-200">
                                                        Editar
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                            </div>
                        :null}
                        
                    </h1>
                    <div>
                        <div className="flex gap-4 items-center text-gray-400 mb-5">
                            Criado por: 
                            <p onClick={()=>navigate(`/Profile/${watchList.user.id}`)}  className="flex items-center gap-2 hover:text-constrastColor cursor-pointer hover:underline"><img className="h-7 w-7 object-cover rounded-full" src={homelander} alt="" />{watchList.user.name}</p>
                            
                            {watchList.isLiked.length > 0?
                                watchList.isLiked.filter((like) => like.watchListId == id).slice(watchList.isLiked.length-1, watchList.isLiked.length).map(like=>{
                                    if(like.watchListId == id && like.userId == authContext.user?.id){
                                        return(
                                            <p key={like.watchListId+like.userId} onClick={newLike} className="flex items-center gap-2 text-xl  cursor-pointer hover:brightness-75 transition-all duration-200"><b className="text-constrastColor"><FaHeart/></b>{watchList.isLiked.length}</p>
                                        )
                                    } else {
                                        return(
                                            <p key={like.watchListId+like.userId} onClick={newLike} className="flex items-center gap-2 text-xl hover:text-darkGreen transition-all duration-200 cursor-pointer"><FaRegHeart/>{watchList.isLiked.length}</p>
                                        )
                                    }
                                })
                            :
                                <p onClick={newLike} className="flex items-center gap-2 text-xl cursor-pointer hover:text-darkGreen"><FaRegHeart/>{watchList.isLiked.length}</p>
                            }
                            <p className="flex items-center gap-2 text-xl"><b className="text-constrastColor"><FaMessage/></b> 672</p>
                        </div>
                        <div className="mb-5">
                            {watchList.authorId == authContext.user?.id?
                            <Dialog open={deleteListDialog} onOpenChange={setDeleteListDialog}>
                                <DialogTrigger>
                                <p className="text-gray-400 hover:text-red-600 transition-all duration-200 cursor-pointer"><FaTrashCan/></p>

                                </DialogTrigger>
                                <DialogContent onClick={onBlurInputList} className="max-w-96 rounded-lg text-left">
                                    <DialogHeader>
                                        <DialogTitle>Deletar lista?</DialogTitle>
                                        <DialogDescription>
                                            Sua lista será deletada permanentemente!
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div>
                                        <button onClick={()=>{
                                            deleteWatchList(watchList.id)
                                            window.location.href = "/PopularWatchLists";
                                            }} className="bg-white w-full border-2 rounded-lg h-11 mt-4 border-constrastColor hover:border-red-600 transition-all duration-200">
                                            Deletar
                                        </button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            :null}
                            
                        </div>
                        <div className="text-gray-400 mb-10">
                            <p className="font-semibold mb-2">Descrição:</p>
                            <p>{watchList.description}</p>
                        </div>
                        <h1 className="text-constrastColor font-semibold text-2xl mb-5">FILMES</h1>
                        <div className="flex justify-stretch gap-6 flex-wrap ">
                            {movies.map(movie =>{
                                return(
                                    <div key={movie.id}>
                                        <img className="h-80" src={`https://image.tmdb.org/t/p/original${movie.movieURLImg}`} alt="" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}