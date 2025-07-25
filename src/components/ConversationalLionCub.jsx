import React, { useState, useRef, useEffect, useCallback } from "react";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";

// Language constants
const LANGUAGES = {
  EN: {
    code: 'en',
    name: 'English',
    intro: 'Hello, I am Leo, your virtual assistant. How can I help you today?',
    listening: 'Listening...',
    startListening: 'Start Listening',
    stopListening: 'Stop Listening',
    stop: 'Stop',
    send: 'Send',
    typeMessage: 'Type your message...',
    error: 'Error:',
    processing: 'Processing...',
    noResponse: 'Sorry, I could not process your request.'
  },
  HI: {
    code: 'hi',
    name: 'हिंदी',
    intro: 'नमस्ते, मैं लियो हूं, आपका वर्चुअल सहायक। मैं आपकी कैसे मदद कर सकता हूं?',
    listening: 'सुन रहा हूं...',
    startListening: 'बोलना शुरू करें',
    stopListening: 'सुनना बंद करें',
    stop: 'रोकें',
    send: 'भेजें',
    typeMessage: 'अपना संदेश लिखें...',
    error: 'त्रुटि:',
    processing: 'प्रोसेस कर रहा हूं...',
    noResponse: 'क्षमा करें, मैं आपका अनुरोध संसाधित नहीं कर सका।'
  }
};

const ConversationalLionCub = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [currentVideo, setCurrentVideo] = useState('video1');
  const [language, setLanguage] = useState('EN');
  const [inputText, setInputText] = useState('');
  
  const t = LANGUAGES[language];
  const INTRO_MESSAGE = t.intro;

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const utteranceRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const videoRef = useRef(null);

  const handleVideoEnd = useCallback(() => {
    console.log('Video ended:', currentVideo);
    if (currentVideo === 'video1') {
      console.log('Intro video ended, switching to idle');
      setHasPlayedIntro(true);
      setCurrentVideo('video2');
    }
  }, [currentVideo]);

  useEffect(() => {
    if (isSpeakingRef.current && hasPlayedIntro) {
      setCurrentVideo('video3');
    } else if (hasPlayedIntro) {
      setCurrentVideo('video2');
    }
  }, [isSpeaking, hasPlayedIntro]);

  // Load and play appropriate video
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      let videoSource;
      switch (currentVideo) {
        case 'video1':
          videoSource = video1;
          break;
        case 'video2':
          videoSource = video2;
          break;
        case 'video3':
          videoSource = video3;
          break;
        default:
          videoSource = video1;
      }
      
      if (video.src !== videoSource) {
        video.src = videoSource;
        
        if (currentVideo === 'video2' || currentVideo === 'video3') {
          video.loop = true;
        } else {
          video.loop = false;
        }
        
        video.play().catch(e => console.error('Video play error:', e));
      }
    }
  }, [currentVideo]);

  const generateVisemeSequence = useCallback((text) => {
    return [{
      viseme: 'talking',
      startTime: 0,
      duration: 3000,
      char: ''
    }];
  }, []);

  const animateVisemes = useCallback((visemeSequence, speechRate = 1.0) => {
    console.log("🎬 Starting video animation");
    
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error('Video play error:', e));
    }
    
    return () => {
      console.log("Animation cleanup called");
    };
  }, []);

  const speak = useCallback((text) => {
    if (!text) return;
    
    window.speechSynthesis.cancel();
    
    setIsSpeaking(false);
    isSpeakingRef.current = false;

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    utterance.lang = language === 'EN' ? 'en-US' : 'hi-IN';
    
    // Set up event handlers
    utterance.onstart = () => {
      console.log("Speech started in", language);
      setIsSpeaking(true);
      isSpeakingRef.current = true;
      
      // Start viseme animation
      const visemeSequence = generateVisemeSequence(text);
      const cleanup = animateVisemes(visemeSequence, utterance.rate || 1.0);
      
      utterance.onend = () => {
        console.log("Speech ended");
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        cleanup && cleanup();
      };
    };

    console.log("Starting speech synthesis in", language);
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 10);
  }, [animateVisemes, generateVisemeSequence, language]);

  useEffect(() => {
    console.log('useEffect for intro message triggered');
    
    if (typeof window === 'undefined') {
      console.log('Not in browser environment');
      return;
    }
    
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser');
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: INTRO_MESSAGE 
      }]);
      return;
    }
    
    console.log('Speech synthesis is supported');
    
    const playIntro = () => {
      try {
        console.log('Attempting to play intro message');
        
        setConversation(prev => {
          console.log('Adding intro message to conversation');
          return [...prev, { role: 'assistant', content: INTRO_MESSAGE }];
        });
        
        speak(INTRO_MESSAGE);
        console.log('Intro message initiated...');
        
      } catch (error) {
        console.error('Error in playIntro:', error);
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          content: INTRO_MESSAGE 
        }]);
      }
    };
    
    console.log('Setting up intro message timer');
    const timer = setTimeout(() => {
      console.log('Timer fired, attempting to play intro');
      playIntro();
    }, 2000);
    
    return () => {
      console.log('Cleaning up intro timeout');
      clearTimeout(timer);
    };
  }, [speak]);

  // Clean up text from API response
  const cleanApiResponse = (text) => {
    if (!text) return '';
    
    let cleaned = text
      .replace(/\*\*(.*?)\*\*/g, '$1') 
      .replace(/\*(.*?)\*/g, '$1') 
      .replace(/`(.*?)`/g, '$1') 
      .replace(/\n\s*\n/g, '\n') 
      .replace(/^\s*[\*\-]\s+/gm, '') 
      .replace(/\s+/g, ' ') 
      .trim();
      
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    return cleaned;
  };

  const processUserInput = useCallback(async (userText) => {
    if (!userText.trim()) return;
    
    try {
      setIsProcessing(true);
      setStatusMessage(t.processing);
      
      setConversation(prev => [...prev, { role: 'user', content: userText }]);
      
      // Add instruction to limit response length
      const promptWithLimit = `${userText} \n\nPlease provide a concise response of about 50 words or less.`;
      
      const response = await fetch('http://localhost:3000/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptWithLimit }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      let cleanedResponse = cleanApiResponse(data.text);
      
      // Additional check to ensure response is not too long
      const words = cleanedResponse.split(' ');
      if (words.length > 60) { 
        cleanedResponse = words.slice(0, 50).join(' ') + '...';
      }
      
      setConversation(prev => [...prev, { role: 'assistant', content: cleanedResponse }]);
      
      // Speak the cleaned response
      speak(cleanedResponse);
      
    } catch (error) {
      console.error("Error processing user input:", error);
      setStatusMessage(t.error + " " + t.noResponse);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: t.noResponse 
      }]);
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [speak]);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language === 'EN' ? 'en-US' : 'hi-IN';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Recognized speech:', transcript);
      processUserInput(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setStatusMessage('');
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current.lang = language === 'EN' ? 'en-US' : 'hi-IN';
        recognitionRef.current.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [processUserInput, language, isListening]);

  // Toggle between English and Hindi
  const toggleLanguage = () => {
    const newLanguage = language === 'EN' ? 'HI' : 'EN';
    setLanguage(newLanguage);
    console.log('Language changed to:', newLanguage);
    
    setConversation([]);
    
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.lang = newLanguage === 'EN' ? 'en-US' : 'hi-IN';
      recognitionRef.current.start();
    }
  };

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setStatusMessage('');
    } else {
      recognitionRef.current.lang = language === 'EN' ? 'en-US' : 'hi-IN';
      recognitionRef.current?.start();
      setStatusMessage(t.listening);
    }
  }, [isListening, language, t]);

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

  // Preload all videos
  useEffect(() => {
    [video1, video2, video3].forEach(videoSrc => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = videoSrc;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div className="conversational-lion-container">
      <div className="language-toggle">
        <button 
          onClick={toggleLanguage}
          className={`lang-button ${language === 'EN' ? 'active' : ''}`}
        >
          {LANGUAGES.EN.name}
        </button>
        <button 
          onClick={toggleLanguage}
          className={`lang-button ${language === 'HI' ? 'active' : ''}`}
        >
          {LANGUAGES.HI.name}
        </button>
      </div>

      <div className="lion-video-container">
        <div className="video-wrapper">
          <div className="video-container">
            {['video1', 'video2', 'video3'].map((video) => (
              <video
                key={video}
                ref={video === currentVideo ? videoRef : null}
                className={video === currentVideo ? 'active' : ''}
                autoPlay
                muted
                loop={video !== 'video1'}
                playsInline
                onEnded={video === 'video1' ? handleVideoEnd : undefined}
                onError={(e) => console.error('Video error:', video, e)}
              >
                <source
                  src={video === 'video1' ? video1 : video === 'video2' ? video2 : video3}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ))}
          </div>
        </div>

        <div className="controls">
          <button
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            disabled={isProcessing || isSpeaking}
          >
            {isListening ? t.stopListening : t.startListening}
          </button>

          <button
            className="stop-button"
            onClick={() => {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
              isSpeakingRef.current = false;
            }}
            disabled={!isSpeaking}
          >
            {t.stop}
          </button>
        </div>

        <div className="status-message">
          {statusMessage || ' '}
        </div>
      </div>

      <div className="conversation-container">
        <div className="chat-header">
          <h2>{language === 'EN' ? 'Chat with Leo' : 'लियो के साथ चैट करें'}</h2>
        </div>

        <div className="chat-messages">
        {conversation.length === 0 ? (
          <div className="welcome-message">
            <p>{language === 'EN' ? 'Welcome to the conversation!' : 'वार्तालाप में आपका स्वागत है!'}</p>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))
        )}
      </div>

      {/* <div className="chat-input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && inputText.trim()) {
              processUserInput(inputText);
              setInputText('');
            }
          }}
          placeholder={t.typeMessage}
          disabled={isProcessing || isSpeaking}
          className="chat-input"
        />
        <button
          onClick={() => {
            if (inputText.trim()) {
              processUserInput(inputText);
              setInputText('');
            }
          }}
          disabled={!inputText.trim() || isProcessing || isSpeaking}
          className="send-button"
        >
          {t.send}
        </button>
      </div> */}
      </div>
    </div>
  );
};

export default ConversationalLionCub;
