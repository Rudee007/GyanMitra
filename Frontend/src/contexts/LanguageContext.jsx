import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'en'
  );

  useEffect(() => {
    // Set initial language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
    setCurrentLanguage(lang);
  };

  const getLanguageCode = (languageName) => {
    const languageMap = {
      'English': 'en',
      'Hindi': 'hi',
      'Urdu': 'ur',
      'Bengali': 'bn',
      'Tamil': 'ta'
    };
    return languageMap[languageName] || 'en';
  };

  const getLanguageName = (languageCode) => {
    const codeMap = {
      'en': 'English',
      'hi': 'Hindi',
      'ur': 'Urdu',
      'bn': 'Bengali',
      'ta': 'Tamil'
    };
    return codeMap[languageCode] || 'English';
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        getLanguageCode,
        getLanguageName
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
