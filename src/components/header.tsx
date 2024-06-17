import { useBackendApi } from "@/api/useBackendApi";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import { profileImgs } from "@/api/profileImg";

interface usersProps{
  id: string,
  name: string,
  imgIndex: number,
  username: string
}

export function Header() {
  const navigate = useNavigate();
  const api = useBackendApi()

  const [users, setUsers] = useState<usersProps[]>([])
  const [text, setText] = useState("")

  async function searchUser(username: string){
    const data = await api.searchUsers(username)
    if(data){
      setUsers(data.users)
    }
  }

  return (
    <div className="flex justify-between items-center h-20 bg-bgAside w-full  relative py-14 dark:bg-black ">
      <h1
        className="font-semibold text-5xl text-constrastColor font-playfair select-none cursor-pointer hover:brightness-75 transition-all ease-in-out duration-200 relative left-12 dark:text-yellow-400"
        onClick={() => navigate("/")}
      >
        Kiwi
      </h1>
      <div className="items-center relative flex right-12">
        <input
          className="bg-darkGreen h-8 w-52 rounded-full pl-3 text-sm outline-none font-montserrat text-mainFontColor whitespace-normal pr-10 dark:bg-yellow-300 dark:text-black"
          type="text"
          placeholder="..."
          onChange={
            (e)=>{
              searchUser(e.target.value)
              setText(e.target.value)
            }
          }
        />
        <p className="text-3xl absolute right-2 text-lightGreen dark:text-black">
          <CiSearch />
        </p>
        <div className={`bg-slate-200 border-2 border-slate-600 w-full absolute top-10 rounded-lg  ${text? null : "hidden"} z-50 flex flex-col gap-2`}>
          {users.map(user =>{
            return(
              <div key={user.id} className="flex gap-2 cursor-pointer hover:brightness-90 transition-all duration-200 bg-slate-200 px-2 py-1 rounded-lg line-clamp-1" onClick={()=>navigate(`/Profile/${user.id}`)}>
                <img className="rounded-full h-10 w-10 object-cover" src={profileImgs[user.imgIndex].url} alt={user.name} />
                <div>
                  <h1 className="font-semibold">{user.name}</h1>
                  <h3>{user.username}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
    </div>
  );
}
