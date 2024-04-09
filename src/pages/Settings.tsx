import { useState } from "react";
import { SideBar } from "../components/sidebar";
import { Header } from "../components/header";
import Faq from "../components/ui/faq";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useBackendApi } from "@/api/useBackendApi";


import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import "../styles/global.css";

type MenuItem = "Perfil" | "Notificações" | "Privacidade e segurança" | "Acessibilidade" | "Ajuda";

export function Settings() {

  const isLoggedIn = !!localStorage.getItem('authToken');

  const [pageTitle, setPageTitle] = useState("Configurações");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem>("Perfil");
  const [expandedItem, setExpandedItem] = useState<string>("");

  const showToastDeleted = () => {
    toast.success("Conta deletada com sucesso.", {
      position: "top-right",
      autoClose: 9000,
    });
  };

  const handleDialogOpenChange = (modalName: string, open: boolean) => {
    switch (modalName) {
      case "delete":
        setIsDeleteDialogOpen(open);
        break;
      case "save":
        setIsDialogOpen(open);
        break;

      }
    };

    //Alterar informaççoes
    const [newName, setnewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newBirthDate, setNewBirthDate] = useState("");
    const [newGender, setNewGender] = useState("");
    const [newCountry] = useState("");
    
    const saveChanges = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Token não encontrado no localStorage');
          return;
        }
        await apiBackend.editUserInfo(token, newName, newEmail, newPassword, newBirthDate, newGender, newCountry);
        showToastMessage();
      } catch (error) {
        console.error("Erro ao salvar alterações:", error);
        showToastMessageError();
      }
    };
    



  const apiBackend = useBackendApi();
  const confirmDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado no localStorage');
        return;
      }
      await apiBackend.deleteUsers(token);
      showToastDeleted();
      setIsDeleteDialogOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setExpandedItem("");
    if (item === "Ajuda") {
      setPageTitle("Perguntas frequentes");
    } else {
      setPageTitle("Configurações");
    }
  };

  const handleItemExpand = (item: string) => {
    setExpandedItem(item === expandedItem ? "" : item);
  };

  const showToastMessage = () => {
    toast.success("Alterações efetuadas com sucesso.", {
      position: "top-right",
      autoClose: 5000,
    });
  };

  const showToastMessageError = () => {
    toast.error("As alterações não foram efetuadas.", {
      position: "top-right",
      autoClose: 5000,})
  };

  const confirmChanges = () => {
    setIsDialogOpen(false);
  };

  const confirmAndSaveChanges = () => {
    saveChanges(); 
    confirmChanges ();
  }

  const renderSettings = () => {
    switch (selectedItem) {
      case "Perfil":
        return (
          <div className="text-mainFontColor font-montserrat ">
            <ul className="">
              <li>
                <p className="mt-5 mb-3 ">Alterar nome de usuário</p>
                <div className="w-full md:w-1/2">
                  <input
                    className="appearance-none block w-5/6 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-username"
                    type="text"
                    placeholder="Novo nome de usuário"
                    value={newName}
  onChange={(e) => setnewName(e.target.value)}
                  />
                </div>
              </li>
           
            </ul>
          </div>
        );

      case "Notificações":
        return (
          <div className="text-mainFontColor font-montserrat">
            <div>
              <input type="checkbox" id="ativarNotificacoes" />
              <label htmlFor="ativarNotificacoes">
                {" "}
                Ativar notificações push
              </label>
            </div>

            <div className="pt-5">
              <input type="checkbox" id="ativarNotificacoes" />
              <label htmlFor="ativarNotificacoes">
                {" "}
                Ativar notificações por email
              </label> 
            </div> 
          </div> 
        ); 

      case "Privacidade e segurança":
        return (
          <div className="text-mainFontColor font-montserrat ">
            <ul className="w-5/6">
              <li>
                <p className=" mt-8 mb-3 ">Alterar email</p>
                <div className="w-full md:w-1/2 ">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-email"
                    type="email"
                    placeholder="Novo email"
                    value={newEmail} onChange={(e) =>setNewEmail(e.target.value)}
                  />
                </div>
              </li>
              <li>
                <p className="mt-8 mb-3">Alterar senha</p>
                <div className=" w-full md:w-1/2 ">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-senha"
                    type="password"
                    placeholder="Nova senha"
                    value={newPassword} onChange={(e) =>setNewPassword(e.target.value)}
                  />
                </div>
               
              </li>
              <li>
                <p className="mt-5 mb-3 ">Alterar data de nascimento</p>
                <div className="w-full md:w-1/2">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-birthDate"
                    type="date"
                    placeholder="Nova data de nascimento"
                    value={newBirthDate}
  onChange={(e) => setNewBirthDate(e.target.value)}
                  />
                </div>
              </li>
              
              <li>
                <p className="mt-5 mb-3 ">Alterar gênero</p>
                <select
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          name="gender"
                          id="gender"
                          value={newGender}
                          onChange={(e) => setNewGender(e.target.value)}
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
              </li>
              <li>
             
              <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => handleDialogOpenChange('delete', open)}>
                  <DialogTrigger className="w-full"></DialogTrigger>
                  <DialogContent className="max-w-96 rounded-lg">
                    <DialogHeader>
                      <DialogTitle>Deletar conta</DialogTitle>
                      <DialogDescription>
                        Tem certeza de que deseja deletar sua conta? Esta ação é irreversível.
                        <p className="font-bold"> Observação: todos seus filmes favoritados e/ou comentados, listas e qualquer outra criação de sua conta serão deletados, e seu perfil não será mais acessível para outros usuários.</p>
                      </DialogDescription>
                    </DialogHeader>
                    <div>
                      <div className="flex justify-center">
                        <button
                          onClick={confirmDeleteAccount}
                          className="bg-red-700 text-black p-4 rounded-lg font-semibold max-w-72 font-montserrat hover:brightness-75 transition-all ease-in-out duration-200 shadow-sm shadow-red-800"
                        >
                          Confirmar exclusão da conta
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <button onClick={() => setIsDeleteDialogOpen(true)} className=" mt-8 mb-3 bg-red-700 text-black p-4 rounded-lg font-semibold max-w-72 font-montserrat hover:brightness-75 transition-all ease-in-out duration-200 shadow-sm shadow-red-800">
                  Deletar minha conta do Kiwi
                </button>
              </li>
            </ul>
          </div>
        );

      case "Ajuda":
        return (
          <div>
            <div>
              <Faq
                question="De onde surgiu o Kiwi?"
                answer="O Kiwi nasceu de um projeto da faculdade. Ele foi desenvolvido para o projeto interdisciplinar do segundo semestre do curso de Desenvolvimento de Software Multiplataforma, da FATEC Zona Leste, de São Paulo. Os membros do grupo são: Camila Aparecida de Castro Soares Paixão, Kauan Santos Oliveira, Ohana Saskia Lopes da Luz, Vitor Dias de Albuquerque e Vitoria Moreno Tomazeli. O site começou a ser desenvolvido em fevereiro de 2024."
                expanded={expandedItem === "O que é o Kiwi?"}
                onClick={() => handleItemExpand("O que é o Kiwi?")}
              />
              <Faq
                question="Para que serve o Kiwi?"
                answer="Com o nosso sistema, você pode ver um catálogo completo e atualizado de filmes, escolher seus favoritos e comentar todos. Além disso, você pode, dentro de seu perfil, criar watchlists, que nada mais são do que listas de filmes que você deseja assistir. Além disso tudo, você ainda consegue seguir e ser seguido pelos seus amigos! Explore o Kiwi e conheça tudo que podemos proporcionar."
                expanded={expandedItem === "Para que serve o Kiwi?"}
                onClick={() => handleItemExpand("Para que serve o Kiwi?")}
              />
              <Faq
                question="Pergunta? 3"
                answer="Resposta."
                expanded={expandedItem === "Pergunta? 3"}
                onClick={() => handleItemExpand("Pergunta? 3")}
              />
            </div>
          </div>
        );

      case "Acessibilidade":
        return (
          <div>
            <div className="text-mainFontColor font-montserrat">
              <h2>Configurações de Acessibilidade</h2>
              <p>Aqui você pode configurar a acessibilidade do seu perfil.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="bg-mainBg flex-initial w-full min-h-screen ">
        <Header />
        <div className="py-14 px-20">
          <div className="flex">
            <ul className="options max-h-56 text-darkGreen font-montserrat font-medium px-6 py-3 bg-bgAside rounded-lg border-none">
              <li
                className={`py-2 cursor-pointer font-bold ${selectedItem === "Perfil" ? "text-lightGreen underline" : "hover:text-lightGreen"}`}
                onClick={() => handleItemClick("Perfil")}
              >
                Perfil
              </li>
              <li
                className={`py-2 cursor-pointer font-bold ${selectedItem === "Notificações" ? "text-lightGreen underline" : "hover:text-lightGreen"}`}
                onClick={() => handleItemClick("Notificações")}
              >
                Notificações
              </li>
              <li
                className={`py-2 cursor-pointer font-bold ${selectedItem === "Privacidade e segurança" ? "text-lightGreen underline" : "hover:text-lightGreen"}`}
                onClick={() => handleItemClick("Privacidade e segurança")}
              >
                Privacidade e segurança
              </li>
              <li
                className={`py-2 cursor-pointer font-bold ${selectedItem === "Acessibilidade" ? "text-lightGreen underline" : "hover:text-lightGreen"}`}
                onClick={() => handleItemClick("Acessibilidade")}
              >
                Acessibilidade
              </li>
              <li
                className={`py-2 cursor-pointer font-bold ${selectedItem === "Ajuda" ? "text-lightGreen underline" : "hover:text-lightGreen"}`}
                onClick={() => handleItemClick("Ajuda")}
              >
                Ajuda
              </li>
            </ul>
            <div className="flex-1 ml-10">
              <h1 className="text-mainFontColor font-montserrat font-bold text-2xl mb-6">
                {pageTitle}
              </h1>
              {isLoggedIn && renderSettings()}

              {isLoggedIn &&  selectedItem !== "Ajuda" && (
                <div className="flex  mt-6 w-2/3">
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-constrastColor text-darkGreen p-4 m-1 rounded-lg font-semibold max-w-72 font-montserrat hover:brightness-75 transition-all ease-in-out duration-200 shadow-sm shadow-constrastColor"
                  >
                    Salvar mudanças
                  </button>
                </div>
              )}

              <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
                <DialogTrigger className="w-full"></DialogTrigger>
                <DialogContent className="max-w-96 rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Confirmar alterações</DialogTitle>
                    <DialogDescription>
                      Certeza de que deseja alterar as informações? Essa ação não poderá ser revertida.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <button onClick={confirmAndSaveChanges} className="bg-white w-full border-2 rounded-lg h-11 mt-4 border-constrastColor hover:brightness-75 transition-all duration-5000">
                      Confirmar
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={5000} />
        </div>
      </div>
    </div>
  );
}
