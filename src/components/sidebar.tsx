import homelander from '../images/homelander-1-1.jpg'

import { FaRegStar  } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { LiaSlidersHSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from '@/context/AuthContext';
import { MdExitToApp } from "react-icons/md";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
  } from "@/components/ui/dialog"

export function SideBar(){

    const path = window.location.pathname
    const navigate = useNavigate()
    const authContext = useContext(LoginContext)

    function goTo(navigateTo: string){
        window.scrollTo({
            top: 0
        })
        navigate(navigateTo)
    }

    return(
        <div className='bg-bgAside h-screen flex-initial w-6vw text-constrastColor text-4xl flex flex-col items-center justify-center p-12 sticky top-0 bottom-0 tablet:hidden mobile:hidden gap-5'>
            {authContext.user?
                <div className='w-16 h-16 rounded-full bg-slate-800 cursor-pointer hover:brightness-75 transition-all ease-in-out duration-200 my-10' onClick={()=>goTo('/Profile')}>
                    <img className={path=='/Profile'?'h-full w-full rounded-full object-cover border-2 border-constrastColor': 'h-full w-full rounded-full object-cover'} src={homelander} alt=""/>
                </div>
            :null}
            <div className='flex justify-center h-96 flex-col gap-10 '>
                <p onClick={()=>goTo('/')} className={path=='/'?'bg-darkGreen p-2 rounded-md':'p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer'}><GoHome/></p>
                <p className='p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer'><LiaSlidersHSolid/></p>
                <p className='p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer'><FaRegStar/></p>
                <p onClick={()=>goTo('/Settings')}  className='p-2 hover:brightness-50 transition-all ease-in-out duration-200 cursor-pointer'><IoSettingsOutline/></p>
                {authContext.user?
                    <Dialog>
                        <DialogTrigger className='w-full'>
                            <p className='p-2 hover:text-red-500 transition-all ease-in-out duration-200 cursor-pointer'><MdExitToApp/></p>
                        </DialogTrigger>
                        <DialogContent className='max-w-64 rounded-lg'>
                            <DialogHeader className='flex items-start '>
                                <DialogTitle>Deseja sair?</DialogTitle>
                                <DialogDescription>
                                    Volte sempre!
                                </DialogDescription>
                            </DialogHeader>
                            <div className='flex items-center justify-around'>
                                <DialogClose className='bg-gray-300 w-20 p-2 rounded-lg hover:brightness-75 transition-all duration-200'>
                                    Cancelar
                                </DialogClose>

                                <button onClick={authContext.signout} className='border-2 w-20 border-constrastColor p-2 rounded-lg hover:border-red-400 transition-all duration-200'>Sair</button>
                            </div>
                        </DialogContent>
                    </Dialog>
                :null}
            </div>
        </div>
    )
    
}