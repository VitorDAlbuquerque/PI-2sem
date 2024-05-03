import { useTMDBApi } from "@/api/useTMDBApi";
import { SideBar } from "../components/sidebar";
import homelander from "../assets/homelander-1-1.jpg";
import { FormEvent, useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { BsFillPlusSquareFill } from "react-icons/bs";

import { FaHeart } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

import { LoginContext } from "@/context/AuthContext";

import { useNavigate, useParams } from "react-router-dom";
import { useBackendApi } from "@/api/useBackendApi";

interface moviesProps {
  id: number;
  movieName: string;
  movieIMG: string;
  movieId: string;
}

interface watchListProps{
  id: string,
  name: string,
  description: string,
  privacy: boolean,
  numberLikes: number,
  banner: string
  user: {
    name: string
  },
  isLiked: [{
    userId: string,
    watchListId: string
  }],
  comment: [{
    userId: string,
  }]
}

interface profileUserProps{
  id: string,
  name: string,
  bio: string,
  theme: string
}

interface movieApiProps {
  id: number;
  adult: boolean;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  backdrop_path: string
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 15));

export function Profile() {
  const [favoriteMovies, setFavoriteMovies] = useState<moviesProps[]>([]);
  const [reviewMovies, setReviewMovies] = useState<moviesProps[]>([]);
  const [openDialogNewList, setOpenDialogNewList] = useState(false);
  const [watchLists, setWatchLists] = useState<watchListProps[]>([]);

  const [newListMovieValueText, setNewListMovieValueText] = useState('')
  const [newListMovieValueId, setNewListMovieValueId] = useState(Number)
  const [resultNewListMovies, setResultNewListMovies] = useState<movieApiProps[]>([]);
  const [newListMovieName, setNewListMovieName] = useState('')
  const [newListMovieURL, setNewListMovieURL] = useState('')

  const [profileColor, setProfileColor] = useState("");
  const [profileColorDialog, setProfileColorDialog] = useState(false);

  const [listName, setListName] = useState("")
  const [listDescription, setListDescription] = useState("")
  const [listPrivacy, setListPrivacy] = useState(Boolean)
  const [movieBanner, setMovieBanner] = useState("")

  const [profileUser, setProfileUser] = useState<profileUserProps>()

  const apiTMDB = useTMDBApi();
  const apiBackend = useBackendApi();
  const {id} = useParams()

  const authContext = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    function getTheme(){
      const labelColor = document.getElementById("profileColor");
      const username = document.getElementById("username");
      const followers = document.getElementById("followers");

      if(profileUser && !profileColor){{
        if(labelColor) labelColor.style.backgroundColor = profileUser.theme
        if(username) username.style.color = profileUser.theme
        if(followers) followers.style.color = profileUser.theme
      }}
    }

    async function getFavoriteMovies() {
      if(id){
        const data = await apiBackend.listFavoriteMovieByUser(id);
        if (data) {
          setFavoriteMovies(data.favorite);
        }
      }
      
    }

    async function getReviews() {
      if(id){
        const data = await apiBackend.listReviewByUser(id);
        if (data) {
          setReviewMovies(data.review);
        }
      }
    }

    async function getWatchLists(id: string) {
      if(profileUser){
        const data = await apiBackend.listWatchListByUser(id);
        if (data) {
          setWatchLists(data.watchList);
        }
      }
    }

    async function getUserById(){
      if(id){
        const data = await apiBackend.getUserById(id);
        if (data) {
          setProfileUser(data.user);
          if(id) getWatchLists(id)
        }
      }
    }
    getTheme()
    getUserById()
    getReviews();
    getFavoriteMovies();
  }, [profileColor, openDialogNewList, profileUser?.id, id, profileColorDialog, authContext.user]);

  function selectColor() {
    const labelColor = document.getElementById("labelColor");
    const profileColor = document.getElementById("profileColor");
    const username = document.getElementById("username");
    const followers = document.getElementById("followers");
    const formColor = document.getElementById("formColor") as HTMLInputElement;
    if (!formColor) return;
    const color = formColor.value;

    if (!labelColor) return;
    labelColor.style.background = color;
    if(profileColor) profileColor.style.backgroundColor = color
    if(username) username.style.color = color
    if(followers) followers.style.color = color
  }

  async function updateProfileColor(e: FormEvent) {
    e.preventDefault();
    wait().then(() => setProfileColorDialog(false));

    const formColor = document.getElementById("formColor") as HTMLInputElement;
    if (!formColor) return;
    const color = formColor.value;
    setProfileColor(color)

    const storageData = localStorage.getItem("authToken");
    
    if (storageData) {
      await apiBackend.updateUserTheme(storageData, color)
      
    }
  }

  async function createWatchList(e: FormEvent){
    e.preventDefault();
    wait().then(() => setOpenDialogNewList(false));
    const storageData = localStorage.getItem("authToken");
    if (storageData) {
      await apiBackend.createNewWatchList(storageData, listName, listDescription, listPrivacy, newListMovieValueId, newListMovieName, newListMovieURL, movieBanner)
    }
  }

  async function getMoviesByName(movieName: string){
    const data = await apiTMDB.getMoviesByName(movieName)
    const divResult = document.getElementById('result')
    if(data){
      setResultNewListMovies(data.movies)
      if(divResult){
        divResult.style.display = 'block'
      }
    }
  }

  function onBlurInputList(){
    const divResult = document.getElementById('result')
    if(divResult){
      divResult.style.display = 'none'
    }
  }

  return (
    <div className="flex">
      <SideBar />
      <div className="bg-mainBg text-emerald-50 w-full min-h-screen font-montserrat">
        {authContext.user?.id == id?
          <Dialog open={profileColorDialog} onOpenChange={setProfileColorDialog}>
            <DialogTrigger className="w-full">
              <div
                className="bg-slate-200 h-80 xs:h-72 tablet:h-72 mobile:h-72
                          flex justify-end items-end p-5 pr-10 hover:brightness-90
                          transition-all ease-in-out duration-200 cursor-pointer w-full"
                id="profileColor"
              ></div>
            </DialogTrigger>
            <DialogContent className="max-w-96 rounded-lg">
              <DialogHeader>
                <DialogTitle>Alterar cor do perfil</DialogTitle>
                <DialogDescription>
                  Personalize seu perfil como preferir ;)
                </DialogDescription>
              </DialogHeader>
              <div>
                <form onSubmit={updateProfileColor}>
                  <label htmlFor="formColor">
                    <p className="w-full h-20 rounded-lg" id="labelColor"></p>
                  </label>
                  <input
                    defaultValue={authContext.user?.theme}
                    className="w-full h-20 border-0 rounded-lg hidden shadow-xl"
                    onChange={selectColor}
                    type="color"
                    name="formColor"
                    id="formColor"
                  />
                  <button className="bg-white w-full border-2 rounded-lg h-11 mt-4 border-constrastColor hover:brightness-75 transition-all duration-200">
                    Confirmar
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
          :
          <div
            className="bg-slate-200 h-80 xs:h-72 tablet:h-72 mobile:h-72
                      flex justify-end items-end p-5 pr-10 
                      transition-all ease-in-out duration-200 w-full"
            id="profileColor"
          ></div>
        }
        

        <div className="p-8 text-slate-200">
          <div className="relative -top-40 flex items-center justify-between ">
            <div className="flex items-center flex-wrap gap-5 ">
              <img
                className="mx-6 h-56 w-48 object-cover border-2 border-mainBg rounded-sm border-b-0"
                src={homelander}
                alt=""
              />
              <div className="flex flex-col gap-5 mt-5 ">
                <h1
                  id="username"
                  className="invert xs:invert-0 tablet:invert-0 mobile:invert-0 text-4xl"
                >
                  {profileUser?.name.toLocaleUpperCase()}
                </h1>
                <p
                  id="followers"
                  className="font-light invert xs:invert-0 tablet:invert-0 mobile:invert-0"
                >
                  123 Followers
                </p>
                <p className="font-light max-w-80 mt-3 min-h-28 ">
                  {profileUser?.bio}
                </p>
              </div>
            </div>
          </div>
          <div className="relative -top-28">
            {/*<div>
              <h1 className='flex justify-center text-constrastColor text-2xl font-semibold mb-10'>TOP 3 FILMES DE {authContext.user?.name.toLocaleUpperCase()}</h1>
              <div className='flex justify-center gap-5 flex-wrap'>
              <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
              <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
              <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
              </div>
            </div>*/}

            <div className="flex items-center mb-5 justify-between mt-20 mobile:justify-center">
              <h1 className="text-constrastColor text-2xl font-semibold">
                FILMES FAVORITOS
              </h1>
            </div>
            <div className="flex flex-wrap gap-7 mobile:justify-center">
              {favoriteMovies.length > 0 ? (
                favoriteMovies.slice(0, 10).map((movie) => {
                  return (
                    <div key={movie.movieId} className="cursor-pointer hover:brightness-50 transition-all ease-in-out duration-200">
                      <Link to={`/movie/${movie.movieId}`}>
                      <img
                        className="h-80 max:h-[480px] 2xl:h-80 xl:h-[295px] lg:h-56 mobile:h-60"
                        src={`https://image.tmdb.org/t/p/original${movie.movieIMG}`}
                        alt={`Cartaz de ${movie.movieName}`}
                      /></Link>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-wrap gap-4 w-full">
                  {authContext.user?.id == id?
                    (
                      <div className="flex min-h-52 w-full items-center justify-center ">
                        <h1>VOCÊ NÃO POSSUI NENHUM FILME FAVORITO.</h1>
                      </div> 
                    )
                  :
                    (
                      <div className="flex min-h-52 w-full items-center justify-center ">
                        <h1>{profileUser?.name.toUpperCase()} NÃO POSSUI NENHUM FILME FAVORITO.</h1>
                      </div> 
                    )
                  }
                </div>
              )}
            </div>
            {favoriteMovies.length > 4 ?
              <div className="flex justify-center mt-5 text-lg ">
                <p className="hover:underline cursor-pointer">Ver todos</p>
              </div>
            :
            null
            }

            <div className="flex items-center mb-5 justify-between mt-20 mobile:justify-center">
              <h1 className="text-constrastColor text-2xl font-semibold">
                FILMES AVALIADOS
              </h1>
            </div>
            <div className="flex flex-wrap gap-7 mobile:justify-center">
              {reviewMovies.length > 0 ? (
                reviewMovies.slice(0, 10).map((movie) => {
                  return (
                    <div key={movie.movieId} className="cursor-pointer hover:brightness-50 transition-all ease-in-out duration-200">
                       <Link to={`/movie/${movie.movieId}`}>
                      <img
                        className="h-80 max:h-[480px] 2xl:h-80 xl:h-[295px] lg:h-56 mobile:h-60"
                        src={`https://image.tmdb.org/t/p/original${movie.movieIMG}`}
                        alt={`Cartaz de ${movie.movieName}`}
                      /></Link>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-wrap gap-4 w-full">
                  {authContext.user?.id == id?
                    (
                    <div className="flex min-h-52 w-full items-center justify-center">
                      <h1>VOCÊ NÃO POSSUI NENHUM FILME AVALIADO.</h1>
                    </div> 
                    )
                  :
                    (
                      <div className="flex min-h-52 w-full items-center justify-center ">
                        <h1>{profileUser?.name.toUpperCase()} NÃO POSSUI NENHUM FILME AVALIADO.</h1>
                      </div> 
                    )
                  }
                </div>
              )}
            </div>
            {reviewMovies.length > 4 ?
              <div className="flex justify-center mt-5 text-lg ">
                <p className="hover:underline cursor-pointer">Ver todos</p>
              </div>
            :
            null
            }

            <div className="mt-20">
            {profileUser?.id == authContext.user?.id?
              <h1 className="text-constrastColor font-semibold text-2xl flex gap-10 items-center">
                MINHAS LISTAS
                <Dialog open={openDialogNewList} onOpenChange={setOpenDialogNewList}>
                  <DialogTrigger>
                      <b className="hover:brightness-75 transition-all ease-in-out duration-200 cursor-pointer"><BsFillPlusSquareFill/></b>
                    
                  </DialogTrigger>
                  <DialogContent onClick={onBlurInputList} className="max-w-96 rounded-lg text-left">
                    <DialogHeader>
                      <DialogTitle>Crie uma nova lista de filmes</DialogTitle>
                      <DialogDescription>
                        Crie listas de filmes à assistir e para indicar ao público!
                      </DialogDescription>
                    </DialogHeader>
                    <div>
                      <form onSubmit={createWatchList} className="text-sm text-slate-500 flex flex-col gap-4">
                        <div>
                          <p className="">Título</p>
                          <input value={listName} onChange={(e)=>{setListName(e.target.value)}} className="w-full h-10 border-[1px] outline-none border-slate-500 rounded-md px-2" type="text" />
                        </div>
                        <div>
                          <p>Descrição</p>
                          <textarea value={listDescription} onChange={(e)=>{setListDescription(e.target.value)}} className="w-full min-h-10 border-[1px] outline-none border-slate-500 rounded-md px-2 py-2" rows={5}></textarea>
                        </div>
                        <div>
                          <p>Escolha o primeiro filme para sua lista</p>
                          <input value={newListMovieValueText} onChange={(e)=>{
                            getMoviesByName(e.target.value)
                            setNewListMovieValueText(e.target.value)
                          }}
                        
                          className="group w-full h-10 border-[1px] outline-none border-slate-500 rounded-md px-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500" type="text" 
                          required
                          
                          />
                          <div id="result" className="bg-white hidden w-[87.5%] border-[1px] outline-none border-slate-500 rounded-md absolute">
                            {resultNewListMovies.slice(0, 5).map(result =>{
                              return(
                                <p key={result.id} onClick={()=>{
                                  setNewListMovieValueText(result.title)
                                  setNewListMovieValueId(result.id)
                                  setNewListMovieName(result.title)
                                  setNewListMovieURL(result.poster_path) 
                                  setMovieBanner(result.backdrop_path)   
                                }} className="py-1 px-2 hover:bg-slate-400 hover:text-white cursor-pointer transition-all ease-in-out duration-200">{result.title}</p>
                              )
                            })}
                            
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input onChange={()=>{setListPrivacy(!listPrivacy)}} type="checkbox" />
                          <p>Lista privada</p>
                        </div>

                        <div className="flex items-center justify-end gap-5 ">
                          <DialogClose onClick={()=>{
                            setNewListMovieValueText("")
                            setListName("")
                            setListDescription("")
                            setListPrivacy(false)
                            setMovieBanner("")
                          }} className="bg-gray-300 w-20 p-2 rounded-lg hover:brightness-75 transition-all duration-200">
                            Cancelar
                          </DialogClose>

                          <button className="border-2 w-20 bg-white border-constrastColor p-2 rounded-lg hover:brightness-90 transition-all duration-200">
                            Criar
                          </button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
                </h1>
                :
                <h1 className="text-constrastColor font-semibold text-2xl flex gap-10 items-center">LISTAS DE {profileUser?.name.toLocaleUpperCase()}</h1>
              }
              <div className="flex flex-wrap gap-3">
                {watchLists.length>0?
                  watchLists.map(watchList =>{
                    return(
                      <div key={watchList.id} className="py-6 px-5 flex flex-col flex-wrap bg-mainBg hover:brightness-75 transition-all ease-in-out duration-200 rounded-lg cursor-pointer" onClick={()=>navigate(`/WatchList/${watchList.id}`)}>
                        <img className="h-48 rounded-lg object-cover" src={`https://image.tmdb.org/t/p/original/${watchList.banner}`} alt= {`Capa da watchlist${watchList.banner}`} />
                            
                        <div className="relative py-5 text-gray-400">
                          <h1 className="text-constrastColor text-xl mb-3">{watchList.name}</h1>
                          <div className="flex gap-7 mb-5">
                            <p className="flex gap-2 items-center"><img className="h-7 w-7 object-cover rounded-full" src={homelander} alt="" />{watchList.user.name}</p>
                            <p className="flex items-center gap-2"><b className="text-constrastColor"><FaHeart/></b> {watchList.isLiked.length}</p>
                            <p className="flex items-center gap-2"><b className="text-constrastColor"><FaMessage/></b>{watchList.comment.length}</p>
                          </div>
                          <div className="max-w-[350px] break-words text-gray-400 font-light">
                            <p className="line-clamp-3">{watchList.description}</p>
                          </div>
                        </div>
                    </div>
                    )
                  })
                :
                <div className="flex min-h-52 w-full items-center justify-center ">
                  <h1>VOCÊ AINDA NÃO POSSUI NENHUMA LISTA</h1>

                </div> 
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
