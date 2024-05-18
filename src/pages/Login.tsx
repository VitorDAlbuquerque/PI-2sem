import { useCountriesApi } from "@/api/useCountriesApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormEvent, useContext, useEffect, useState } from "react";

import { LoginContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBackendApi } from "@/api/useBackendApi";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface countriesProps {
  name: {
    official: string;
  };
  translations: {
    por: {
      common: string;
    };
  };
}


export function Login() {
  const [nextTrue, setNextTrue] = useState(false);
  const [countries, setCountries] = useState<countriesProps[]>([]);

  const apiCountries = useCountriesApi();
  const authContext = useContext(LoginContext);
  const navigate = useNavigate();
  const apiBackend = useBackendApi();

  function nextSignup(e: FormEvent) {
    e.preventDefault();
    const firstSignup = document.getElementById("firstSignup");
    const nextSignup = document.getElementById("nextSignup");

    setNextTrue(!nextTrue);

    if (nextTrue == false) {
      if (firstSignup && nextSignup) {
        firstSignup.style.display = "none";
        nextSignup.style.display = "flex";
      }
    } else {
      if (firstSignup && nextSignup) {
        firstSignup.style.display = "flex";
        nextSignup.style.display = "none";
      }
    }
  }

  if (authContext.user) {
    navigate("/");
  }

  useEffect(() => {
    async function getCountries() {
      const data = await apiCountries.getCountries();
      if (data) {
        setCountries(data.countries);
      }
    }
    getCountries();
  }, []);

  async function auth(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    authContext.signin(String(data.username), String(data.password));
   
  }
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");

  const registerLogic = async (e: FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    if (!name) {
      errors.push("O campo de nome de usuário é nulo.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email || "")) {
      errors.push("Por favor, insira um e-mail válido.");
    }

    if ((password || "").length < 8) {
      errors.push("A senha deve ter no mínimo 8 caracteres.");
    }

    if ((name || "").length < 5) {
      errors.push("O nome de usuário deve ter no mínimo 5 caracteres.");
    }

    const birthDate = new Date(dob || "");
    const today = new Date();
    const minAge = 18;
    const minAgeDate = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate(),
    );

    if (birthDate > minAgeDate) {
      errors.push(`Você deve ter pelo menos ${minAge} anos para se cadastrar.`);
    }

    if (!gender) {
      errors.push("Por favor, selecione um gênero.");
    }

    if (!country) {
      errors.push("Por favor, selecione um país.");
    }

    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i]);
      }
      return;
    }
    
    const data = await apiBackend.createNewUser(
      name,
      username,
      email,
      password,
      dob,
      gender,
      country,
    );

    if (data) {
      authContext.signin(email, password);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="bg-kiwi-bg h-screen w-screen bg-cover"></div>
      <div className="absolute top-0 left-0 w-full bg-gradient-to-l from-mainBg from-30% to-mainBgOpacity75">
        <div className="flex items-center pl-10 h-10vh">
          <h1
            className="font-playfair font-semibold select-none text-constrastColor text-4xl cursor-pointer hover:brightness-75 transition-all ease-in-out duration-200"
            onClick={() => navigate("/")}
          >
            Kiwi
          </h1>
        </div>
        <div className="flex h-90vh ">
          <div className="flex-1 flex justify-center items-center lg:hidden md:hidden sm:hidden xs:hidden tablet:hidden mobile:hidden"></div>
          <div className="flex-1 flex justify-center items-center ">
            <Tabs defaultValue="login">
              <TabsContent value="login">
                <div className="bg-bgAside w-96 rounded-lg p-5 flex items-center flex-col">
                  <h1 className="text-constrastColor font-montserrat font-semibold text-3xl">
                    Seja bem-vindo
                  </h1>
                  <p className="text-bgWathcList">
                    Faça login em sua conta do Kiwi!
                  </p>
                  <form
                    onSubmit={auth}
                    className="flex flex-col gap-5 w-11/12 mt-5"
                  >
                    <div>
                      <p className="text-bgWathcList">Email:</p>
                      <input
                        name="username"
                        className="w-full h-10 rounded-sm outline-none pl-3"
                        type="text"
                      />
                    </div>
                    <div>
                      <p className="text-bgWathcList">Senha:</p>
                      <input
                        name="password"
                        className="w-full h-10 rounded-sm outline-none pl-3"
                        type="password"
                      />
                    </div>
                    <button className="bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200">
                      Entrar
                    </button>
                  </form>
                  <p onClick={()=>navigate("/RecoverPassword")} className="text-bgWathcList mt-3 hover:text-constrastColor cursor-pointer transition-all duration-200">Esqueceu a senha?</p>
                  <p className="text-bgWathcList mt-3">ou</p>

                  <TabsList className="bg-bgAside">
                    <p className="text-bgWathcList">
                      Ainda não possui uma conta?
                      <TabsTrigger
                        value="signup"
                        className="underline text-constrastColor"
                      >
                        Cadastre-se
                      </TabsTrigger>
                    </p>
                  </TabsList>
                </div>
              </TabsContent>
              <TabsContent value="signup">
                <div className="bg-bgAside min-h-420px w-96 rounded-lg p-5 flex items-center flex-col">
                  <h1 className="text-constrastColor font-montserrat font-semibold text-3xl ">
                    Cadastre-se
                  </h1>
                  <p className="text-bgWathcList">
                    Faça seu cadastro e aproveite o Kiwi!
                  </p>
                  <form
                    onSubmit={registerLogic}
                    className="flex gap-3 w-11/12 mt-3"
                  >
                    <div
                      className="w-full flex flex-col gap-3"
                      id="firstSignup"
                    >
                      <div>
                        <p className="text-bgWathcList">Nome:</p>
                        <input
                          className="w-full h-10 rounded-sm outline-none pl-3"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <p className="text-bgWathcList">Email:</p>
                        <input
                          className="w-full h-10 rounded-sm outline-none pl-3"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <p className="text-bgWathcList">Senha:</p>
                        <input
                          className="w-full h-10 rounded-sm outline-none pl-3"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <p className="text-bgWathcList">Confirme a senha:</p>
                        <input
                          className="w-full h-10 rounded-sm outline-none pl-3"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <button
                        className="bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200"
                        onClick={nextSignup}
                      >
                        Avançar
                      </button>
                    </div>
                    <div
                      id="nextSignup"
                      className="hidden flex-col gap-3 w-full"
                    >
                      <div>
                        <p className="text-bgWathcList">Nome de usuário:</p>
                        <input
                          className="w-full h-10 rounded-sm outline-none pl-3"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div>
                        <p className="text-bgWathcList">Data de nascimento:</p>
                        <input
                          className="w-full h-10 rounded-sm outline-none px-3"
                          type="date"
                          id="dateOfBirth"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>
                      <div>
                        <p className="text-bgWathcList">Qual seu gênero:</p>
                        <select
                          className="w-full h-10 rounded-sm outline-none px-3"
                          name="gender"
                          id="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="" disabled hidden>
                            Gênero{" "}
                          </option>
                          <option value="Homem">Homem</option>
                          <option value="Mulher">Mulher</option>
                          <option value="Pessoa não binária">
                            Pessoa não binária
                          </option>
                          <option value="Outro">Outro</option>
                          <option value="Prefiro não responder">
                            Prefiro não responder
                          </option>
                        </select>
                      </div>
                      <div>
                        <p className="text-bgWathcList">País:</p>
                        <select
                          className="w-full h-10 rounded-sm outline-none px-3"
                          name="country"
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <option value="" disabled hidden>
                            País
                          </option>
                          {countries
                            ? countries.map((country) => {
                                return (
                                  <option
                                    key={country.name.official}
                                    value={country.translations.por.common}
                                  >
                                    {country.translations.por.common}
                                  </option>
                                );
                              })
                            : null}
                        </select>
                      </div>

                      <button className="bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200">
                        Cadastrar-se
                      </button>
                      <p
                        onClick={nextSignup}
                        className="flex justify-center text-constrastColor cursor-pointer hover:underline"
                      >
                        voltar
                      </p>
                    </div>
                  </form>
                  <p className="text-bgWathcList mt-1">ou</p>

                  <TabsList className="bg-bgAside">
                    <p className="text-bgWathcList">
                      Já possui uma conta?
                      <TabsTrigger
                        value="login"
                        className="underline text-constrastColor"
                      >
                        Faça login
                      </TabsTrigger>
                    </p>
                  </TabsList>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            />
          
        </div>
      </div>
    </div>
    
  );
}
