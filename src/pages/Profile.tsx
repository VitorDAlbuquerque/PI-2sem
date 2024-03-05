import { SideBar } from '../components/sidebar';
import homelander from '../images/homelander-1-1.jpg'


export function Profile(){
    return(
        <div className='flex'>
            <SideBar/>
            <div className='bg-mainBg text-emerald-50 w-full min-h-screen font-montserrat'>
                <div className='bg-slate-200 h-80 flex justify-end items-end p-5 pr-10'>
                </div>
                <div className='p-10 text-slate-200'>
                    <div className='relative -top-40 flex items-center justify-between '>
                        <div className='flex items-center flex-wrap gap-5'>
                            <img className='h-56 w-48 object-cover border-4 border-mainBg border-b-0' src={homelander} alt="" />
                             <div className='flex flex-col gap-5 mt-5'>
                                <h1 className='invert-0 xs:invert test:invert text-4xl '>Homelander fodido</h1>
                                <p className='font-light invert-0 xs:invert test:invert'>123 Followers</p>
                                <p className='font-light w-80'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et commodi quam fugiat ipsa neque ad facere. Alias enim animi et.</p>

                            </div>   

                        </div>
                    </div>
                    <div className='relative -top-16'>
                        <div>
                            <h1 className='flex justify-center text-constrastColor text-2xl font-semibold mb-10'>TOP 3 FILMES DE Homelander fodido</h1>
                            <div className='flex justify-center gap-5 flex-wrap'>
                                <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
                                <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
                                <img className='h-96' src="https://image.tmdb.org/t/p/original/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg" alt="" />
                            </div>
                        </div> 
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}