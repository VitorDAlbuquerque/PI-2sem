import { GoHome } from "react-icons/go";
import { LiaSlidersHSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "@/context/AuthContext";
import { MdExitToApp } from "react-icons/md";

import { BsListCheck } from "react-icons/bs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { profileImgs } from "@/api/profileImg";

export function SideBar() {
  const path = window.location.pathname;
  const navigate = useNavigate();
  const authContext = useContext(LoginContext);

  function goTo(navigateTo: string) {
    window.scrollTo({
      top: 0,
    });
    navigate(navigateTo);
  }

  return (
    <div className="bg-bgAside h-screen flex-initial w-6vw text-constrastColor top-0 text-4xl mobile:text-3xl flex flex-col items-center justify-center p-12 sticky bottom-0 mobile:fixed z-20 mobile:bottom-0 mobile:top-auto mobile:py-7 mobile:px-2 mobile:flex-row mobile:w-full mobile:h-8 gap-3 mobile:justify-between dark:bg-black dark:text-yellow-400">
      {authContext.user ? (
        <div
          className="w-16 h-16 mobile:w-10 mobile:h-10 rounded-full cursor-pointer hover:brightness-75 transition-all ease-in-out duration-200 my-10"
          onClick={() => goTo(`/Profile/${authContext.user?.id}`)}
        >
          <img
            className={
              path == `/Profile/${authContext.user.id}`
                ? "h-full w-full rounded-full object-cover border-2 border-constrastColor dark:border-yellow-400"
                : "h-full w-full rounded-full object-cover"
            }
            src={profileImgs[authContext.user.imgIndex].url}
            alt=""
          />
        </div>
      ) : null}
      <div className="flex justify-center h-96 flex-col gap-10 mobile:flex-row mobile:h-11 mobile:gap-8">
        <p
          onClick={() => goTo("/")}
          className={
            path == "/"
              ?  " dark:bg-gray-700  bg-darkGreen p-2 rounded-md flex items-center justify-center"
              : "p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer  "
          }
        >
          <GoHome />
        </p>
        <p
          onClick={() => goTo("/Movies?page=1")}
          className={
            path == "/Movies"
              ? "dark:bg-gray-700  bg-darkGreen p-2 rounded-md"
              : "p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer"
          }
        >
          <LiaSlidersHSolid />
        </p>
        <p className={
            path == "/PopularWatchLists"
              ? "dark:bg-gray-700  bg-darkGreen p-2 rounded-md"
              : "p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer"
          } onClick={() => goTo("/PopularWatchLists")}>
          <BsListCheck />
        </p>
        <p
          onClick={() => goTo("/Settings")}
          className={
            path == "/Settings"
              ? "dark:bg-gray-700 xs:mobile:hidden bg-darkGreen p-2 rounded-md"
              : "p-2 hover:brightness-50 transition-all mobile:hidden ease-in-out duration-300 cursor-pointer"
          }
        >
          <IoSettingsOutline />
        </p>
        <Popover>
          <PopoverTrigger className="xl:hidden sm:hidden md:hidden lg:hidden 2xl:hidden max:hidden xs:hidden">
            <p
              className={
                path == "/Settings"
                  ? "dark:bg-gray-700  bg-darkGreen p-2 rounded-md"
                  : "p-2 hover:brightness-50 transition-all ease-in-out duration-300 cursor-pointer"
              }
            >
              <IoSettingsOutline />
            </p>
          </PopoverTrigger>
          <PopoverContent className="max-w-44 flex flex-col gap-2">
              <div className="w-full" onClick={() => goTo("/Settings")}>
                Configurações
              </div>
              {authContext.user ? (
                <Dialog>
                  <DialogTrigger className="text-left">
                    <div >
                      Sair
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-64 rounded-lg dark:bg-black dark:border-white">
                    <DialogHeader className="flex items-start ">
                      <DialogTitle>Deseja sair?</DialogTitle>
                      <DialogDescription className="dark:text-white">Volte sempre!</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-around ">
                      <DialogClose className="bg-gray-300 w-20 p-2 rounded-lg hover:brightness-75 transition-all duration-200 dark:bg-white dark:text-black dark:border-white">
                        Cancelar
                      </DialogClose>

                      <button
                        onClick={authContext.signout}
                        className="dark:bg-black dark:text-yellow-400 border-2 w-20 dark:border-yellow-400 border-constrastColor p-2 rounded-lg hover:border-red-400 transition-all duration-200 dark:hover:bg-gray-950 dark:hover:border-yellow-400"
                      >
                        Sair
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : null}
              
          </PopoverContent>
        </Popover>
        
        {authContext.user ? (
          <Dialog>
            <DialogTrigger className="w-full">
              <p className="p-2 hover:text-red-500 transition-all ease-in-out duration-200 cursor-pointer dark:hover:text-white mobile:hidden">
                <MdExitToApp />
              </p>
            </DialogTrigger>
            <DialogContent className="max-w-64 rounded-lg dark:bg-black dark:border-white">
              <DialogHeader className="flex items-start ">
                <DialogTitle>Deseja sair?</DialogTitle>
                <DialogDescription className="dark:text-white">Volte sempre!</DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-around ">
                <DialogClose className="bg-gray-300 w-20 p-2 rounded-lg hover:brightness-75 transition-all duration-200 dark:bg-white dark:text-black dark:border-white">
                  Cancelar
                </DialogClose>

                <button
                  onClick={authContext.signout}
                  className="dark:bg-black dark:text-yellow-400 border-2 w-20 dark:border-yellow-400 border-constrastColor p-2 rounded-lg hover:border-red-400 transition-all duration-200 dark:hover:bg-gray-950 dark:hover:border-yellow-400"
                >
                  Sair
                </button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    </div>
  );
}
