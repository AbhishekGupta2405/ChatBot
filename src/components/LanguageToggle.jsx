import React from 'react';
import { useLanguage } from './LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage, LANGUAGES } = useLanguage();

  return (
    <div className="language-toggle">
      <button
        onClick={toggleLanguage}
        className={`lang-button ${language === "EN" ? "active" : ""}`}
      >
        {LANGUAGES.EN.name}
      </button>
      <button
        onClick={toggleLanguage}
        className={`lang-button ${language === "HI" ? "active" : ""}`}
      >
        {LANGUAGES.HI.name}
      </button>
    </div>
  );
};

export default LanguageToggle;