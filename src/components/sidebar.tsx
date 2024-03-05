import homelander from '../images/homelander-1-1.jpg'

import { FaRegStar  } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { LiaSlidersHSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export function SideBar(){

    const navigate = useNavigate();
    const path = window.location.pathname
    return(
        <div className='bg-bgAside h-screen flex-initial w-6vw text-constrastColor text-4xl hidden sm:flex flex-col items-center justify-center p-12 sticky top-0 bottom-0'>
            <div className='flex-initial flex items-center h-28'>
                <div className='w-16 h-16 rounded-full bg-slate-800 cursor-pointer hover:brightness-75 transition-all ease-in-out duration-200' onClick={()=>navigate('/Profile')}>
                    <img className={path=='/Profile'?'h-full w-full rounded-full object-cover border-2 border-constrastColor': 'h-full w-full rounded-full object-cover'} src={homelander} alt=""/>
                </div>
            </div>
            <div className='flex justify-center h-96 flex-col gap-10 '>
                <p onClick={()=>navigate('/')} className={path=='/'?'bg-darkGreen p-2 rounded-md':'p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer'}><GoHome/></p>
                <p className='p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer'><LiaSlidersHSolid/></p>
                <p className='p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer'><FaRegStar/></p>
                <p className='p-2 hover:brightness-50 transition-all ease-in-out duration-200 cursor-pointer'><IoSettingsOutline/></p>
            </div>
        </div>
    )
    
}