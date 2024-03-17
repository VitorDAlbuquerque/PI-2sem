import { SideBar } from '../components/sidebar';
import '../styles/global.css';
import { useNavigate } from 'react-router-dom';

    export function Settings (){


        const navigate = useNavigate();
         return (
        <div className="flex">
           
            <div className="bg-mainBg min-h-screen font-playfair min-w-full flex">
            <SideBar/>   
                <div className='Main p-9'>
                <h1 className='font-semibold text-5xl text-constrastColor p-2 cursor-pointer' onClick={()=>navigate('/')} >Kiwi</h1> 

                    <div id='selectionSettings' className="bg-indigo-700">
                        
                        <ul>
                            <li className='hover:list-disc cursor-pointer'>
                                Perfil
                            </li>
                            <li className='hover:list-disc cursor-pointer'>
                                Privacidade
                            </li>
                            <li className='hover:list-disc cursor-pointer'>
                                Config1
                            </li>
                            <li className='hover:list-disc cursor-pointer'>
                                Acessibilidade
                            </li>
                            <li className='hover:list-disc cursor-pointer'>
                                Ajuda
                            </li>
                        </ul>
                    </div>



                </div>



                </div>
        </div>






    )
}