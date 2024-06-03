import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
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
        />
        <p className="text-3xl absolute right-2 text-lightGreen dark:text-black">
          <CiSearch />
        </p>
      </div>
    </div>
  );
}
