import { Header } from "@/components/header";
import { SideBar } from "@/components/sidebar";

import { FaHeart  } from "react-icons/fa";
import { FaMessage  } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useBackendApi } from "@/api/useBackendApi";
import { useNavigate } from "react-router-dom";
import { profileImgs } from "@/api/profileImg";

interface watchListProps{
    id: string,
    name: string,
    description: string,
    privacy: boolean,
    numberLikes: number,
    banner: string,
    user: {
      name: string,
      id: string,
      imgIndex: number
    },
    isLiked: [{
        userId: string,
        watchListId: string
    }],
    comment: [{
        userId: string,
    }]
}

export function PopularWatchLists() {
    const apiBackend = useBackendApi();
    const navigate = useNavigate();
    const [watchlists, setWatchlists] = useState<watchListProps[]>([])

    useEffect(()=>{
        async function getPopularWatchLists(){
            const data = await apiBackend.getPopularWatchLists()
            if(data){
                setWatchlists(data.watchList)
            }
        }
        getPopularWatchLists()
    }, [])

    return(
        <div className="flex">
            <SideBar />
            <div className="bg-mainBg flex-initial w-full min-h-screen dark:bg-black">
                <Header />
                <div className="p-10">
                    <h1 className="text-constrastColor font-semibold text-2xl dark:text-yellow-300">LISTAS POPULARES</h1>
                    <div className="flex flex-wrap gap-2">

                        {watchlists.map(watchList =>{
                            return(
                                <div key={watchList.id} className="py-6 px-5 flex flex-col flex-wrap bg-mainBg hover:brightness-75 transition-all ease-in-out duration-200 rounded-lg cursor-pointer dark:bg-black " onClick={()=>navigate(`/WatchList/${watchList.id}`)}>
                                    <img className="h-48 rounded-lg object-cover" src={`https://image.tmdb.org/t/p/original/${watchList.banner}`} alt={`Capa da watchlist${watchList.banner}`} />
                                        
                                    <div className="relative py-5 text-gray-400">
                                        <h1 className="text-constrastColor text-xl mb-3 dark:text-yellow-400">{watchList.name}</h1>
                                        <div className="flex gap-7 mb-5">
                                            <div className="flex gap-2 items-center"><img className="h-7 w-7 object-cover rounded-full" src={profileImgs[watchList.user.imgIndex].url} alt="" /><p className="hover:text-constrastColor hover:underline dark:hover:text-yellow-400">{watchList.user.name}</p></div>
                                            <p className="flex items-center gap-2"><b className="text-constrastColor dark:text-yellow-400"><FaHeart/></b> {watchList.isLiked.length}</p>
                                            <p className="flex items-center gap-2"><b className="text-constrastColor dark:text-yellow-400"><FaMessage/></b>{watchList.comment.length}</p>
                                        </div>
                                        <div className="max-w-[350px] break-words text-gray-400 font-light">
                                            <p className="line-clamp-3">{watchList.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>  
            </div>
        </div>
    )
}