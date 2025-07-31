import React, { useState, useCallback } from 'react';
import { useLanguage } from './LanguageContext';

const ChatUI = ({ conversation, onTextSubmit, isProcessing }) => {
  const { language, t } = useLanguage();
  const [textInput, setTextInput] = useState("");

  const handleTextSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (textInput.trim() && !isProcessing) {
        onTextSubmit(textInput.trim());
        setTextInput("");
      }
    },
    [textInput, isProcessing, onTextSubmit]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleTextSubmit(e);
      }
    },
    [handleTextSubmit]
  );

  return (
    <div className="conversation-container">
      <div className="chat-header">
        <h2>{t.chatWithLeo}</h2>
      </div>

      <div className="chat-messages">
        {conversation.length === 0 ? (
          <div className="welcome-message">
            <h3>{t.welcome}</h3>
            <p>{t.helpText}</p>
            <ul>
              {t.examples.map((example, index) => (
                <li key={index}>"{example}"</li>
              ))}
            </ul>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))
        )}
      </div>

      {/* Text input for testing - can be removed in production */}
      {/* <form
        onSubmit={handleTextSubmit}
        style={{ display: "flex", gap: "8px", marginTop: "12px" }}
      >
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={t.typeMessage}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            opacity: isProcessing ? 0.6 : 1,
            cursor: isProcessing ? "not-allowed" : "pointer"
          }}
        >
          {t.send}
        </button>
      </form> */}
    </div>
  );
};

export default ChatUI;