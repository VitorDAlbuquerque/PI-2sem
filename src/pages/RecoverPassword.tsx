import { FormEvent, useContext, useState, } from "react";

import { LoginContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import emailjs from '@emailjs/browser'
import { useBackendApi } from "@/api/useBackendApi";


export function RecoverPassowrd() {

  const authContext = useContext(LoginContext);
  const navigate = useNavigate();
  const randomCode = Math.floor(Math.random() * 100000);
  const apiBackend = useBackendApi()

  if (authContext.user) {
    navigate("/");
  }

  const [email, setEmail] = useState("")
  const [page, setPage] = useState(1)
  const [code, setCode] = useState('')
  const [emailCode, setEmailCode] = useState(randomCode)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const templateParams = {
    to_email: email,
    code: emailCode,
  }

  async function sendEmail(e: FormEvent) {
    e.preventDefault()
    await emailjs.send("service_3csmmgq", "template_42fcfi8", templateParams, "utGvGRrBcVsGkVOMu")
    .then(() =>{
      setEmailCode(templateParams.code)
    })
    setPage(2)
  }

    
  function confirmCode(e: FormEvent){
    e.preventDefault()
    if(code == String(emailCode)){
      setPage(3)
    }
  }

  async function updatePassword(e: FormEvent){
    e.preventDefault();
    if(password == confirmPassword){
      await apiBackend.updatePassword(email, password)

      authContext.signin(email, password);

    }
  }

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
            <div className="bg-bgAside h-420px w-96 rounded-lg p-5 flex items-center flex-col">
              <h1 className="text-constrastColor font-montserrat font-semibold text-3xl">
                Recuperar senha
              </h1>
              {page == 1?
                <div className="flex flex-col gap-5 w-11/12 mt-5 justify-center">
                  <p className="text-bgWathcList text-center">Use seu email e recupere sua conta!</p>
                  <form onSubmit={sendEmail} className="flex flex-col gap-5 w-full justify-center">
                      <div>
                        <p className="text-bgWathcList">Email:</p>
                        <input
                          name="username"
                          className="w-full h-10 rounded-sm outline-none pl-3"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <button className="bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200">
                          Enviar
                      </button>
                  </form>
                </div>
              :page==2?
                <div className="flex flex-col gap-5 w-11/12 mt-5 justify-center">
                  <p className="text-bgWathcList text-center">Quase lá, confirme o código de segurança no seu email.</p>
                
                  <form onSubmit={confirmCode} className="flex flex-col gap-5 w-full justify-center">
                    <div>
                      <p className="text-bgWathcList">Código de segurança:</p>
                      <input
                          name="username"
                          className="w-full h-10 rounded-sm outline-none pl-3"
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                      />
                    </div>
                    <button className="bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200">
                      Enviar
                    </button>
                    <p onClick={()=>setPage(1)} className="text-bgWathcList hover:underline cursor-pointer text-center">Voltar</p>

                  </form>
                </div>
              :page==3?
                <form onSubmit={updatePassword} className="flex flex-col gap-5  w-11/12 mt-5 justify-center">
                  <div>
                      <p className="text-bgWathcList">Nova senha:</p>
                      <input
                        name="username"
                        className="w-full h-10 rounded-sm outline-none pl-3"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>
                  <div>
                    <p className="text-bgWathcList">confrime a nova senha:</p>
                    <input
                      name="username"
                      className="w-full h-10 rounded-sm outline-none pl-3"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button className="bg-constrastColor text-darkGreen font-semibold font-montserrat text-1xl h-10 rounded-sm mt-3 hover:brightness-75 transition-all ease-in-out duration-200">
                    Enviar
                  </button>
                  <p onClick={()=>setPage(1)} className="text-bgWathcList hover:underline cursor-pointer text-center">Voltar</p>

                </form>
              :null
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
