import React, { createContext, useContext, useState } from 'react';

// Language constants
const LANGUAGES = {
  EN: {
    code: "en",
    name: "English",
    intro: "Hello, I am Leo, your virtual assistant. How can I help you today?",
    listening: "Listening...",
    startListening: "Start Listening",
    stopListening: "Stop Listening",
    stop: "Stop Talking",
    send: "Send",
    typeMessage: "Type your message...",
    error: "Error:",
    processing: "Processing...",
    noResponse: "Sorry, I could not process your request.",
    welcome: "Welcome to TechMall!",
    helpText: "I can help you find phones in our mall. Try asking:",
    backToChat: "← Back to Chat",
    chatWithLeo: "Chat with Leo - Your Assistant",
    examples: [
      "Where can I find iPhone 16 Pro Max?",
      "Show me Samsung Galaxy phones",
      "Compare Pixel 9 Pro vs OnePlus 13",
      "I need a phone with good camera"
    ]
  },
  HI: {
    code: "hi",
    name: "हिंदी",
    intro: "नमस्ते, मैं लियो हूं, आपका वर्चुअल सहायक। मैं आपकी कैसे मदद कर सकता हूं?",
    listening: "सुन रहा हूं...",
    startListening: "बोलना शुरू करें",
    stopListening: "सुनना बंद करें",
    stop: "बात रोकें",
    send: "भेजें",
    typeMessage: "अपना संदेश लिखें...",
    error: "त्रुटि:",
    processing: "प्रोसेस कर रहा हूं...",
    noResponse: "क्षमा करें, मैं आपका अनुरोध संसाधित नहीं कर सका।",
    welcome: "टेकमॉल में आपका स्वागत है!",
    helpText: "मैं आपको हमारे मॉल में फोन खोजने में मदद कर सकता हूं। पूछने की कोशिश करें:",
    backToChat: "← चैट पर वापस जाएं",
    chatWithLeo: "लियो के साथ चैट करें - आपका मददकर्ता",
    examples: [
      "आईफोन 16 प्रो मैक्स कहाँ मिल सकता है?",
      "मुझे सैमसंग गैलेक्सी फोन दिखाएं",
      "पिक्सल 9 प्रो और वनप्लस 13 की तुलना करें",
      "मुझे अच्छे कैमरे वाला फोन चाहिए"
    ]
  },
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("EN");

  const toggleLanguage = () => {
    const newLanguage = language === "EN" ? "HI" : "EN";
    setLanguage(newLanguage);
    console.log("Language changed to:", newLanguage);
  };

  const t = LANGUAGES[language];

  const value = {
    language,
    t,
    toggleLanguage,
    LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};