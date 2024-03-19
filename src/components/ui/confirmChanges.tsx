import React, { useState, useEffect } from 'react';

interface ConfirmChangesProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  checkboxChecked: boolean;
  setCheckboxChecked: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveChanges: () => void;
}

const ConfirmChanges: React.FC<ConfirmChangesProps> = ({
  showModal,
  setShowModal,
  checkboxChecked,
  setCheckboxChecked,
  handleSaveChanges,
}) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showConfirmation) {
      timeout = setTimeout(() => {
        setShowConfirmation(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [showConfirmation]);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-mainFontColor p-6 rounded-lg shadow-xl transition-all duration-200 ease-in-out">
            <button className="absolute top-0 right-0 mr-4 mt-4 text-gray-400 hover:text-gray-200" onClick={closeModal}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-center mb-4">Tem certeza que deseja efetuar as alterações? Essa ação não poderá ser revertida.</p>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" checked={checkboxChecked} onChange={handleCheckboxChange} />
              <span className="ml-2">Eu confirmo que desejo efetuar as alterações.</span>
            </label>
            <div className="text-center mt-4">
              <button className="bg-darkGreen hover:bg-lightGreen transition duration-200 ease-in-out text-white font-semibold py-2 px-4 rounded mr-4 disabled:opacity-50" onClick={() => {
                handleSaveChanges();
                setShowConfirmation(true);
              }} disabled={!checkboxChecked}>Continuar</button>
              <button className="bg-gray-300 transition duration-200 ease-in-out hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="fixed bottom-0 right-0 m-4 p-2 bg-lightGreen opacity-80 text-darkGreen rounded transition-all duration-300 ease-in-out">
          <span className="mr-2">Alterações efetuadas com sucesso!</span>
          <button className="text-darkGreen hover:text-gray-800" onClick={() => setShowConfirmation(false)}>x</button>
        </div>
      )}
    </>
  );
};

export default ConfirmChanges;
