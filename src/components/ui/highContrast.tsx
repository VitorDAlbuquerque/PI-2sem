// useDarkMode.js
import { useEffect } from 'react';

const highContrast = () => {
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);
};

export default highContrast;
