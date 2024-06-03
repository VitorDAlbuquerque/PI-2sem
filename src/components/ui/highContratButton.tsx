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
      className="toggle-button"
      variant="outline"
      size="default"  
    >
      {darkMode ? 'Modo comum' : 'Modo alto contraste'}
    </Toggle>
  );
};

export default highContrastButton;
