import { useCountriesApi } from "@/api/useCountriesApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormEvent, useEffect, useState } from "react";


interface countriesProps {
    translations:{
        por: {
            common: string
        }
    }
}

export function Login(){

    const [nextTrue, setNextTrue] = useState(false);
    const [countries, setCountries] = useState<countriesProps[]>([])

    function nextSignup(e: FormEvent){
        e.preventDefault();
        const firstSignup = document.getElementById('firstSignup');
        const nextSignup = document.getElementById('nextSignup');

        setNextTrue(!nextTrue) 

        if(nextTrue == false){
            if(firstSignup && nextSignup){
                firstSignup.style.display = 'none';
                nextSignup.style.display = 'flex';
            }
        } else {
            if(firstSignup && nextSignup){
                firstSignup.style.display = 'flex';
                nextSignup.style.display = 'none';
            }
        }
    }

    const api = useCountriesApi()

    useEffect(()=>{
        async function getCountries(){
            const data = await api.getCountries();
            if(data){
                setCountries(data.countries)
            }
        } 
        getCountries()
    }, [])

    return (
        <div className="min-h-screen ">
            <div className='bg-kiwi-bg h-screen w-screen bg-cover'></div>
            <div className='absolute top-0 left-0 w-full bg-gradient-to-l from-mainBg from-30% to-mainBgOpacity75'>
            
                <div className="flex items-center pl-10 h-10vh">
                    <h1 className="font-playfair text-constrastColor text-4xl">Kiwi</h1>
                </div>
                <div className='flex h-90vh '>
                    <div className='flex-1 flex justify-center items-center'>
                    
                    </div>
                    <div className='flex-1 flex justify-center items-center '>
                        
                        <Tabs defaultValue="login">
                            <TabsContent value="login">
                                <div className='bg-bgAside h-420px w-96 rounded-lg p-5 flex items-center flex-col'>
                                    <h1 className='text-constrastColor font-montserrat font-semibold text-3xl'>Seja bem-vindo</h1>
                                    <p className='text-bgWathcList'>Faça login em sua conta do Kiwi!</p>
                                    <form className='flex flex-col gap-5 w-11/12 mt-5'>
                                        <div>
                                            <p className='text-bgWathcList'>Email:</p>
                                            <input className='w-full h-10 rounded-sm outline-none pl-3' type="text" />
                                        </div>
                                        <div>
                                            <p className='text-bgWathcList'>Senha:</p>
                                            <input className='w-full h-10 rounded-sm outline-none pl-3' type="password" />
                                        </div>
                                        <button className='bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200'>Entrar</button>
                                    </form>
                                    <p className='text-bgWathcList mt-3'>ou</p>

                                    <TabsList className="bg-bgAside">
                                        <p className='text-bgWathcList'>Ainda não possui uma conta?<TabsTrigger value="signup" className="underline text-constrastColor">Cadastre-se</TabsTrigger></p>
                                    </TabsList>
                                </div>
                                
                            </TabsContent>
                            <TabsContent value="signup">
                                <div className='bg-bgAside min-h-420px w-96 rounded-lg p-5 flex items-center flex-col'>
                                    <h1 className='text-constrastColor font-montserrat font-semibold text-3xl '>Cadastre-se</h1>
                                    <p className='text-bgWathcList'>Faça seu cadastro e aproveite o Kiwi!</p>
                                    <form className='flex gap-3 w-11/12 mt-5'>
                                        <div className="w-full flex flex-col gap-3" id="firstSignup">
                                            <div>
                                                <p className='text-bgWathcList'>Nome de usuário:</p>
                                                <input className='w-full h-10 rounded-sm outline-none pl-3' type="text" />
                                            </div>
                                            <div>
                                                <p className='text-bgWathcList'>Email:</p>
                                                <input className='w-full h-10 rounded-sm outline-none pl-3' type="text" />
                                            </div>
                                            <div>
                                                <p className='text-bgWathcList'>Senha:</p>
                                                <input className='w-full h-10 rounded-sm outline-none pl-3' type="password" />
                                            </div>
                                            <div>
                                                <p className='text-bgWathcList'>Confirme a senha:</p>
                                                <input className='w-full h-10 rounded-sm outline-none pl-3' type="password" />
                                            </div>
                                            <button className='bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200' onClick={nextSignup}>Avançar</button>
                                        </div>
                                        <div id="nextSignup" className="hidden flex-col gap-3 w-full">
                                            <div>
                                                <p className='text-bgWathcList'>Data de nascimento:</p>
                                                <input className='w-full h-10 rounded-sm outline-none px-3' type="date" />
                                            </div>
                                            <div>
                                                <p className='text-bgWathcList'>Qual seu gênero:</p>
                                                <select className="w-full h-10 rounded-sm outline-none px-3" name="gender" id="gender">
                                                    <option value="" selected disabled hidden>Gênero</option>
                                                    <option value="Homem">Homem</option>
                                                    <option value="Mulher">Mulher</option>
                                                    <option value="Pessoa não binária">Pessoa não binária</option>
                                                    <option value="Outro">Outro</option>
                                                    <option value="Prefiro não responder">Prefiro não responder</option>
                                                </select>
                                            </div>
                                            <div>
                                                <p className='text-bgWathcList'>Páis:</p>
                                                <select className="w-full h-10 rounded-sm outline-none px-3" name="country" id="country">
                                                    <option value="" selected disabled hidden>País</option>
                                                    {countries?
                                                    countries.map(country =>{
                                                        return(
                                                            <option key={country.translations.por.common} value={country.translations.por.common}>{country.translations.por.common}</option>
                                                        )
                                                    }): null}
                                                    
                                                </select>
                                            </div>
                                            
                                            <button className='bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200' onClick={nextSignup}>Cadastrar-se</button>
                                            <p onClick={nextSignup} className="flex justify-center text-constrastColor cursor-pointer hover:underline">voltar</p>
                                        </div>
                                    </form>
                                    <p className='text-bgWathcList mt-3'>ou</p>

                                    <TabsList className="bg-bgAside">
                                        <p className='text-bgWathcList'>Já possui uma conta?<TabsTrigger value="login" className="underline text-constrastColor">Faça login</TabsTrigger></p>
                                    </TabsList>
                                </div>
                            </TabsContent>
                        </Tabs>
                            
                    </div>
                </div>
            </div>
        </div>
    )
}