import { useState } from "react";
import { SideBar } from "../components/sidebar";
import { Header } from "../components/header";
import Faq from "../components/ui/faq";
import ConfirmChanges from "../components/ui/confirmChanges";
import "../styles/global.css";

export function Settings() {
  const [pageTitle, setPageTitle] = useState("Configurações");

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setExpandedItem("");
    if (item === "Ajuda") {
      setPageTitle("Perguntas frequentes");
    } else {
      setPageTitle("Configurações");
    }
  };

  const [selectedItem, setSelectedItem] = useState("Perfil");
  const [expandedItem, setExpandedItem] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleItemExpand = (item: string) => {
    setExpandedItem(item === expandedItem ? "" : item);
  };

  const handleSaveChanges = () => {
    console.log("Alterações salvas!");
    setShowConfirmModal(false);
  };
  const renderInformation = () => {
    switch (selectedItem) {
      case "Perfil":
        return (
          <div className="text-mainFontColor font-montserrat">
            <ul className="">
              <li>
                <p className="mt-5 mb-3">Alterar nome de usuário</p>
                <div className="w-full md:w-1/2">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-username"
                    type="text"
                    placeholder="Novo nome de usuário"
                  />
                </div>
              </li>
              <li className="mt-8 mb-3">
                <p>Alterar foto de perfil</p>
                <div className="flex justify-between">
                  <div className="w-1/4 bg-blue-200 rounded-md shadow-md border-2 border-transparent hover:border-lightGreen cursor-pointer h-32"></div>
                  <div className="w-1/4 bg-red-200 rounded-md shadow-md border-2 border-transparent hover:border-lightGreen cursor-pointer h-32"></div>
                  <div className="w-1/4 bg-yellow-200 rounded-md shadow-md border-2 border-transparent hover:border-lightGreen cursor-pointer h-32"></div>
                  <div className="w-1/4 bg-green-200 rounded-md shadow-md border-2 border-transparent hover:border-lightGreen cursor-pointer h-32"></div>
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
            <ul className="">
              <li>
                <p className="mt-8 mb-3 ">Alterar email</p>
                <div className="w-full md:w-1/2 ">
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-email"
                    type="email"
                    placeholder="Novo email"
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
                  />
                </div>
              </li>
            </ul>
          </div>
        );

      case "Acessibilidade":
        return (
          <div className="text-mainFontColor font-montserrat">
            <h2>Configurações de Acessibilidade</h2>
            <p>Aqui você pode configurar a acessibilidade do seu perfil.</p>
          </div>
        );
      case "Ajuda":
        return (
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
        );
      default:
        return null;
    }
  };

  const showButtons = selectedItem !== "Ajuda";

  return (
    <div className="flex">
      <SideBar />
      <div className="bg-mainBg flex-initial w-full min-h-screen ">
        <Header />
        <div className="py-7 px-10">
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
              {renderInformation()}
              {showButtons && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="transition ease-in-out delay-150 bg-darkGreen hover:-translate-y-1 hover:scale-110 hover:bg-lightGreen duration-300 p-3 rounded-lg m-5"
                  >
                    Salvar mudanças
                  </button>
                  <button className="transition ease-in-out delay-150 bg-darkGreen hover:-translate-y-1 hover:scale-110 hover:bg-lightGreen duration-300 p-3 rounded-lg m-5">
                    Descartar mudanças
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmChanges
        showModal={showConfirmModal}
        setShowModal={setShowConfirmModal}
        checkboxChecked={checkboxChecked}
        setCheckboxChecked={setCheckboxChecked}
        handleSaveChanges={handleSaveChanges}
      />
    </div>
  );
}
