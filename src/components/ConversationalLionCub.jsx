import React, { useState, useEffect, useCallback } from "react";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import LanguageToggle from "./LanguageToggle";
import LionCub from "./LionCub";
import ChatUI from "./ChatUI";
import { useSpeechService } from "./SpeechService";
import { usePhoneSearchService } from "./PhoneSearchService";
import { useAPIService } from "./APIService";
import PhoneDisplayManager from "./PhoneDisplayManager";

const ConversationalLionCubContent = () => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("video1");
  const [showPhoneDetails, setShowPhoneDetails] = useState(false);
  const [showPhoneComparison, setShowPhoneComparison] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [comparisonPhones, setComparisonPhones] = useState({
    phone1: null,
    phone2: null,
  });

  const INTRO_MESSAGE = t.intro;

  // Custom hooks for services
  const { handlePhoneSearch } = usePhoneSearchService(
    language,
    setSelectedPhone,
    setShowPhoneDetails,
    setComparisonPhones,
    setShowPhoneComparison
  );

  const { callGeminiAPI } = useAPIService();

  const { speak, stopSpeaking, recognitionRef, isSpeakingRef, setUserInputHandler } = useSpeechService(
    language,
    null, // We'll set this later
    setIsSpeaking,
    setCurrentVideo,
    hasPlayedIntro,
    setHasPlayedIntro
  );

  // Process user input - defined after useSpeechService to access speak function
  const processUserInput = useCallback(async (userText) => {
    if (!userText.trim()) return;

    // Stop listening when processing starts
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatusMessage("");
    }

    try {
      setIsProcessing(true);
      setStatusMessage(t.processing);

      setConversation((prev) => [
        ...prev,
        { role: "user", content: userText },
      ]);

      // Check if it's a phone-related query (English and Hindi keywords)
      const phoneKeywords = [
        // English keywords
        "phone", "mobile", "smartphone", "iphone", "galaxy", "pixel", "oneplus", "xiaomi",
        "find", "where", "location", "compare", "samsung", "apple", "google", "honor", "vivo", "oppo",
        // Hindi keywords
        "फोन", "मोबाइल", "स्मार्टफोन", "आईफोन", "गैलेक्सी", "पिक्सल", "वनप्लस", "शाओमी",
        "ढूंढो", "कहाँ", "स्थान", "तुलना", "सैमसंग", "एप्पल", "गूगल", "ऑनर", "विवो", "ओप्पो",
        "मिल", "चाहिए", "दिखाओ", "बताओ", "कौन", "सा", "कैसा", "कितना", "दाम", "कीमत"
      ];
      const isPhoneQuery = phoneKeywords.some((keyword) =>
        userText.toLowerCase().includes(keyword)
      );

      if (isPhoneQuery) {
        // Handle phone search locally
        const phoneResponse = handlePhoneSearch(userText);
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: phoneResponse },
        ]);
        speak(phoneResponse);
      } else {
        // Use Gemini API for general queries
        const cleanedResponse = await callGeminiAPI(userText);

        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: cleanedResponse },
        ]);
        speak(cleanedResponse);
      }
    } catch (error) {
      console.error("Error processing user input:", error);
      setStatusMessage(t.error + " " + t.noResponse);
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t.noResponse,
        },
      ]);
      speak(t.noResponse);
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [isListening, recognitionRef, setIsListening, setStatusMessage, setIsProcessing, setConversation, t, handlePhoneSearch, speak, callGeminiAPI]);

  // Set the speech recognition callback after processUserInput is defined
  useEffect(() => {
    if (setUserInputHandler) {
      console.log("Setting user input handler for speech recognition");
      setUserInputHandler(processUserInput);
    }
  }, [setUserInputHandler, processUserInput]);

  // Handle video state changes based on speaking
  useEffect(() => {
    if (isSpeaking && hasPlayedIntro) {
      setCurrentVideo("video3");
    } else if (hasPlayedIntro) {
      setCurrentVideo("video2");
    }
  }, [isSpeaking, hasPlayedIntro]);

  // Define playIntro function
  const playIntro = useCallback(async () => {
    console.log("Attempting to play intro message");
    console.log("hasPlayedIntro:", hasPlayedIntro);
    console.log("INTRO_MESSAGE:", INTRO_MESSAGE);
    console.log("speak function:", typeof speak);
    
    if (hasPlayedIntro) {
      console.log("Intro already played, skipping");
      return;
    }

    if (!INTRO_MESSAGE) {
      console.log("INTRO_MESSAGE is empty, skipping");
      return;
    }

    if (typeof speak !== 'function') {
      console.log("speak function not available, skipping");
      return;
    }

    console.log("Adding intro message to conversation:", INTRO_MESSAGE);
    setConversation((prev) => {
      const newConversation = [
        ...prev,
        {
          role: "assistant",
          content: INTRO_MESSAGE,
        },
      ];
      console.log("New conversation:", newConversation);
      return newConversation;
    });
    
    console.log("Calling speak function with:", INTRO_MESSAGE);
    speak(INTRO_MESSAGE);
  }, [hasPlayedIntro, INTRO_MESSAGE, speak]);

  // Play intro message - trigger when component mounts and dependencies are ready
  useEffect(() => {
    console.log("useEffect for intro message triggered");
    console.log("hasPlayedIntro:", hasPlayedIntro);
    console.log("INTRO_MESSAGE available:", !!INTRO_MESSAGE);
    console.log("speak function available:", typeof speak === 'function');
    
    if (!hasPlayedIntro && INTRO_MESSAGE && typeof speak === 'function') {
      console.log("All conditions met, setting timer for intro");
      const timer = setTimeout(() => {
        console.log("Timer fired, attempting to play intro");
        playIntro();
      }, 2000); // 2 second delay to ensure everything is loaded

      return () => {
        console.log("Cleaning up intro timer");
        clearTimeout(timer);
      };
    } else {
      console.log("Conditions not met for intro:", {
        hasPlayedIntro,
        hasIntroMessage: !!INTRO_MESSAGE,
        hasSpeakFunction: typeof speak === 'function'
      });
    }
  }, [hasPlayedIntro, INTRO_MESSAGE, speak, playIntro]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    console.log("Toggle listening called, current state:", isListening);
    console.log("Recognition ref:", recognitionRef.current);

    if (isListening) {
      console.log("Stopping speech recognition");
      recognitionRef.current?.stop();
      setStatusMessage("");
    } else {
      console.log("Starting speech recognition");
      if (recognitionRef.current) {
        recognitionRef.current.lang = language === "EN" ? "en-US" : "hi-IN";
        console.log("Recognition language set to:", recognitionRef.current.lang);
        try {
          recognitionRef.current.start();
          console.log("Speech recognition started successfully");
          setStatusMessage(t.listening);
        } catch (error) {
          console.error("Error starting speech recognition:", error);
          setStatusMessage("Error starting microphone");
          return;
        }
      } else {
        console.error("Recognition ref is null");
        setStatusMessage("Speech recognition not available");
        return;
      }
    }
    setIsListening(!isListening);
  }, [isListening, language, t]);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === "EN" ? "en-US" : "hi-IN";
    }

    // Clear conversation when language changes
    setConversation([]);

    // Stop listening if currently listening (don't restart automatically)
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatusMessage("");
    }
  }, [language]); // Remove isListening from dependencies to prevent restart loop

  // Handle text input submission
  const handleTextSubmit = useCallback((text) => {
    processUserInput(text);
  }, [processUserInput]);

  // Phone display handlers
  const handleClosePhoneDetails = useCallback(() => {
    setShowPhoneDetails(false);
    setSelectedPhone(null);
  }, []);

  const handleClosePhoneComparison = useCallback(() => {
    setShowPhoneComparison(false);
    setComparisonPhones({ phone1: null, phone2: null });
  }, []);

  return (
    <div className="conversational-lion-container">
      <LanguageToggle />

      {/* Dynamic layout based on state */}
      {!showPhoneDetails && !showPhoneComparison ? (
        // Original layout: video left, chat right
        <div className="main-content-original">
          {/* Video container - left side */}
          <LionCub
            currentVideo={currentVideo}
            setCurrentVideo={setCurrentVideo}
            setHasPlayedIntro={setHasPlayedIntro}
            hasPlayedIntro={hasPlayedIntro}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isProcessing={isProcessing}
            onToggleListening={toggleListening}
            onStopSpeaking={stopSpeaking}
            cornerMode={false}
          />

          {/* Chat container - right side */}
          <ChatUI
            conversation={conversation}
            onTextSubmit={handleTextSubmit}
            isProcessing={isProcessing}
          />
        </div>
      ) : (
        // Phone details/comparison layout: content left, video lower right
        <div className="main-content-phone">
          {/* Content area for phone details or comparison */}
          <PhoneDisplayManager
            showPhoneDetails={showPhoneDetails}
            showPhoneComparison={showPhoneComparison}
            selectedPhone={selectedPhone}
            comparisonPhones={comparisonPhones}
            onClosePhoneDetails={handleClosePhoneDetails}
            onClosePhoneComparison={handleClosePhoneComparison}
          />

          {/* Video container - lower right corner */}
          <LionCub
            currentVideo={currentVideo}
            setCurrentVideo={setCurrentVideo}
            setHasPlayedIntro={setHasPlayedIntro}
            hasPlayedIntro={hasPlayedIntro}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isProcessing={isProcessing}
            onToggleListening={toggleListening}
            onStopSpeaking={stopSpeaking}
            cornerMode={true}
          />
        </div>
      )}
    </div>
  );
};

// Main component wrapped with Language Provider
const ConversationalLionCub = () => {
  return (
    <LanguageProvider>
      <ConversationalLionCubContent />
    </LanguageProvider>
  );
};

export default ConversationalLionCub;