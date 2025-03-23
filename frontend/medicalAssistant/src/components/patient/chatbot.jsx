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
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  
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
    
    // Simulate AI response with some common medical questions
    setTimeout(() => {
      let botResponse = "";
      const userInput = input.toLowerCase();
      
      if (userInput.includes('prescription') || userInput.includes('medication') || userInput.includes('refill')) {
        botResponse = "To request a prescription refill, please upload your current prescription and select the 'Request Refill' option. Your doctor will be notified automatically.";
      } else if (userInput.includes('appointment') || userInput.includes('schedule') || userInput.includes('book')) {
        botResponse = "You can schedule an appointment from the Appointments tab. Would you like me to help you navigate there?";
      } else if (userInput.includes('result') || userInput.includes('test') || userInput.includes('lab')) {
        botResponse = "Your lab results will appear in the Medical History tab once they're processed. The typical processing time is 2-3 business days after your doctor reviews them.";
      } else if (userInput.includes('symptom') || userInput.includes('pain') || userInput.includes('feel')) {
        botResponse = "I can help you track your symptoms, but remember that I'm not a replacement for medical advice. Would you like to create a symptom journal entry?";
      } else {
        botResponse = "Thank you for your message. While I can help with general information, it's best to consult with your healthcare provider for specific medical advice. Is there something else I can assist you with?";
      }
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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
            disabled={isTyping || !input.trim()}
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