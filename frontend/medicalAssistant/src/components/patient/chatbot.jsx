import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaSpinner, FaRobot, FaUser, FaChevronDown, FaChevronUp, FaExpand, FaComments } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot = ({ onMinimize, onExpand }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your medical assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [patientName, setPatientName] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Get patient name from local storage on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user').username;
      console.log("Retrieved from localStorage:", storedUser);

      if (storedUser) {
        // If stored as JSON, parse it
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed user data:", parsedUser);
          setPatientName(parsedUser.name || parsedUser);
        } catch {
          // If not JSON, use as is
          console.log("Using storedUser as string:", storedUser);
          setPatientName(storedUser);
        }
      } else {
        console.log("No user found in localStorage, using default");
        setPatientName('allen');
      }
    } catch (error) {
      console.error('Error accessing local storage:', error);
      setPatientName('allen');
    }
  }, []);

  // Auto-scroll to the bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Ensure chat is maximized when a new message is sent
    if (isMinimized) {
      toggleMinimize();
    }

    try {
      // Format messages for API
      const formattedMessages = messages.map(msg => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.text
      }));

      // Add current message
      formattedMessages.push({
        role: 'user',
        content: input
      });

      const requestBody = {
        messages: formattedMessages,
        patientName: patientName
      };

      console.log("Sending request to API:", requestBody);

      // Call the API
      const response = await fetch('http://localhost:3000/api/create/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      // Get response text first for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      // Check if response is OK and not empty
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${responseText || 'No response body'}`);
      }

      // Parse JSON only if we have some content
      let data;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          console.error("Failed to parse response as JSON:", error);
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
        }
      } else {
        throw new Error("Empty response from server");
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.answer || "Sorry, I received an empty response. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error communicating with AI:', error);

      // Add more detailed error message
      const errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${error.message}. Please check the console for more details.`,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle chat minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (onMinimize) {
      onMinimize(!isMinimized);
    }
  };

  // Toggle expanded view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) {
      onExpand(!isExpanded);
    }
  };

  // If minimized, show only the chat icon
  if (isMinimized) {
    return (
      <div className="chatbot-icon-container">
        <button
          className="chatbot-icon"
          onClick={toggleMinimize}
          aria-label="Open chat"
        >
          <FaComments />
          <span className="unread-indicator"></span>
        </button>
      </div>
    );
  }

  // Return the full chatbot UI if not minimized
  return (
    <div
      className={`chatbot ${isExpanded ? 'expanded' : ''}`}
      ref={chatContainerRef}
    >
      <div className="chatbot-header">
        <div className="chatbot-title">
          <FaRobot className="title-icon" />
          <span>Medical Assistant</span>
          {patientName && <small className="ml-2 text-xs opacity-75">({patientName})</small>}
        </div>
        <div className="chatbot-controls">
          <button
            className="control-button expand-button"
            onClick={toggleExpand}
            aria-label={isExpanded ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <FaExpand />
          </button>
          <button
            className="control-button minimize-button"
            onClick={toggleMinimize}
            aria-label="Minimize chat"
          >
            <FaChevronDown />
          </button>
        </div>
      </div>

      <div className="chat-body">
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'bot' ? (
                  <FaRobot className="bot-avatar" />
                ) : (
                  <FaUser className="user-avatar" />
                )}
              </div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot typing">
              <div className="message-avatar">
                <FaRobot className="bot-avatar" />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="chat-input"
            disabled={isTyping}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isTyping || !input.trim() || !patientName}
            aria-label="Send message"
          >
            {isTyping ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;