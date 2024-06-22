import  { useState, useEffect } from 'react';
import { Toggle } from './toggle';

const highContrastButton = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <Toggle
      pressed={darkMode}
      onPressedChange={toggleDarkMode}
      className="toggle-button p-5 m-1 dark:border-yellow-400 dark:bg-black dark:hover:opacity-90"
      variant="outline"
      size="default"  
    >
      {darkMode ? 'Ativar modo comum' : 'Ativar modo alto contraste'}
    </Toggle>
  );
};

export default highContrastButton;
