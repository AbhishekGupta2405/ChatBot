import { useRef, useCallback, useEffect } from 'react';

export const useSpeechService = (language, onUserInput, setIsSpeaking, setCurrentVideo, hasPlayedIntro, setHasPlayedIntro) => {
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const onUserInputRef = useRef(onUserInput);

  // Update the ref when onUserInput changes
  useEffect(() => {
    onUserInputRef.current = onUserInput;
  }, [onUserInput]);

  // Function to log available voices (for debugging)
  const logAvailableVoices = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default
    })));
    
    const hindiVoices = voices.filter(voice => 
      voice.lang === "hi-IN" || 
      voice.lang === "hi" || 
      voice.name.toLowerCase().includes("hindi")
    );
    console.log("Hindi voices found:", hindiVoices.length, hindiVoices);
  }, []);

  // Load voices when component mounts
  useEffect(() => {
    if (window.speechSynthesis) {
      // Voices might not be loaded immediately
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', logAvailableVoices, { once: true });
      } else {
        logAvailableVoices();
      }
    }
  }, [logAvailableVoices]);

  const generateVisemeSequence = useCallback((text) => {
    return [
      {
        viseme: "talking",
        startTime: 0,
        duration: 3000,
        char: "",
      },
    ];
  }, []);

  const animateVisemes = useCallback((visemeSequence, speechRate = 1.0) => {
    console.log("🎬 Starting video animation");
    return () => {
      console.log("Animation cleanup called");
    };
  }, []);

  const speak = useCallback(
    (text) => {
      if (!text) return;

      window.speechSynthesis.cancel();

      setIsSpeaking(false);
      isSpeakingRef.current = false;

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set language for speech synthesis
      utterance.lang = language === "EN" ? "en-US" : "hi-IN";
      
      // Use the same voice for both Hindi and English for consistency
      const voices = window.speechSynthesis.getVoices();
      
      // First try to find a Hindi voice (preferred for both languages)
      const hindiVoice = voices.find(voice => 
        voice.lang === "hi-IN" || 
        voice.lang === "hi" || 
        voice.name.toLowerCase().includes("hindi") ||
        voice.name.toLowerCase().includes("devanagari")
      );
      
      if (hindiVoice) {
        utterance.voice = hindiVoice;
        console.log(`Using Hindi voice for ${language}:`, hindiVoice.name);
      } else {
        // Fallback to English voice if Hindi voice not available
        const englishVoice = voices.find(voice => 
          voice.lang === "en-US" || 
          voice.lang === "en-GB" || 
          voice.lang.startsWith("en")
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
          console.log(`Using English voice for ${language}:`, englishVoice.name);
        }
      }

      // Set speech rate and pitch for better pronunciation
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Set up event handlers
      utterance.onstart = () => {
        console.log("Speech started in", language, "with voice:", utterance.voice?.name || "default");
        setIsSpeaking(true);
        isSpeakingRef.current = true;

        // If this is the intro message and hasn't been marked as played, set it now
        if (typeof setHasPlayedIntro === 'function' && !hasPlayedIntro && text && (text.trim() === "Hello, I am Leo, your virtual assistant. How can I help you today?" || text.trim() === "नमस्ते, मैं लियो हूं, आपका वर्चुअल सहायक। मैं आपकी कैसे मदद कर सकता हूं?")) {
          console.log("Setting hasPlayedIntro to true from SpeechService (intro detected)");
          setHasPlayedIntro(true);
        }

        // Switch to talking video when speaking
        if (hasPlayedIntro) {
          setCurrentVideo("video3");
        }

        // Start viseme animation
        const visemeSequence = generateVisemeSequence(text);
        const cleanup = animateVisemes(visemeSequence, utterance.rate || 1.0);

        utterance.onend = () => {
          console.log("Speech ended");
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          
          // Switch back to idle video when done speaking
          if (hasPlayedIntro) {
            setCurrentVideo("video2");
          }
          
          cleanup && cleanup();
        };
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        if (hasPlayedIntro) {
          setCurrentVideo("video2");
        }
      };

      console.log("Starting speech synthesis in", language, "with lang setting:", utterance.lang);
      
      // Ensure voices are loaded before speaking
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          // Retry voice selection after voices are loaded
          if (language === "HI") {
            const voices = window.speechSynthesis.getVoices();
            const hindiVoice = voices.find(voice => 
              voice.lang === "hi-IN" || 
              voice.lang === "hi" || 
              voice.name.toLowerCase().includes("hindi")
            );
            if (hindiVoice) {
              utterance.voice = hindiVoice;
            }
          }
          window.speechSynthesis.speak(utterance);
        }, { once: true });
      } else {
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 10);
      }
    },
    [animateVisemes, generateVisemeSequence, language, setIsSpeaking, setCurrentVideo, hasPlayedIntro]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
    
    // Switch back to idle video
    if (hasPlayedIntro) {
      setCurrentVideo("video2");
    }
  }, [setIsSpeaking, setCurrentVideo, hasPlayedIntro]);

  // Function to set the user input handler dynamically
  const setUserInputHandler = useCallback((handler) => {
    onUserInputRef.current = handler;
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    console.log("Initializing speech recognition...");
    
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    console.log("Speech recognition is supported");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    console.log("Creating new SpeechRecognition instance");
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language === "EN" ? "en-US" : "hi-IN";
    
    console.log("Speech recognition configured with language:", recognitionRef.current.lang);

    recognitionRef.current.onstart = () => {
      console.log("Speech recognition started");
    };

    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended");
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Recognized speech:", transcript);
      if (onUserInputRef.current) {
        console.log("Calling onUserInput with transcript:", transcript);
        onUserInputRef.current(transcript);
      } else {
        console.warn("onUserInputRef.current is null, cannot process transcript");
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error, event);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onUserInput]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stopSpeaking,
    recognitionRef,
    isSpeakingRef,
    setUserInputHandler
  };
};