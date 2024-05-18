import { Header } from "@/components/header";
import { SideBar } from "@/components/sidebar";
import imgError from '../assets/404 error lost in space-rafiki.svg'
export function Page404Error(){
    return(
        <div className="flex">
            <SideBar />
            <div className="bg-mainBg flex-initial w-full min-h-screen">
                <Header />
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-2xl text-constrastColor font-semibold mt-10">PÁGINA NÃO ENCONTRADA!</h1>
                    <img className="h-96" src={imgError} alt="" />
                </div>
            </div>
        </div>
    )
}