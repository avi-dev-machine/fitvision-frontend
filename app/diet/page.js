'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Apple, ChevronRight, AlertCircle } from 'lucide-react';
import styles from './diet.module.css';

// Backend API URL - use environment variable or fallback to localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DietPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your personal diet assistant powered by AI. I analyze your workout performance to provide tailored nutrition advice. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load exercise history from localStorage for context
  const getExerciseHistory = () => {
    if (typeof window !== 'undefined') {
      const lastTest = localStorage.getItem('lastTest');
      if (lastTest) {
        const parsed = JSON.parse(lastTest);
        return {
          total_tests: parseInt(localStorage.getItem('totalTests') || '0'),
          recent_exercises: [parsed],
          avg_performance_score: 75,
          streak_days: parseInt(localStorage.getItem('streakDays') || '0'),
          last_test_date: parsed.date || 'Today'
        };
      }
    }
    return null;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    
    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userMessage
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Call backend API
      const response = await fetch(`${API_BASE}/api/diet/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          exercise_history: getExerciseHistory()
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.response
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Diet chat error:', err);
      setError('Could not connect to AI assistant. Make sure the backend is running.');
      
      // Fallback response
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ I\'m having trouble connecting to the server. Please ensure the backend is running at ' + API_BASE
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.iconWrapper}>
            <Apple size={24} />
          </div>
          <div>
            <h1 className={styles.title}>Dietary Assistant</h1>
            <p className={styles.subtitle}>AI-Powered Nutrition Guide</p>
          </div>
        </div>
      </header>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}
            >
              <div className={styles.messageAvatar}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={styles.messageBubble}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.message} ${styles.botMessage}`}>
              <div className={styles.messageAvatar}>
                <Bot size={16} />
              </div>
              <div className={styles.typingIndicator}>
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your diet..."
            className={styles.input}
          />
          <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isTyping}>
            <Send size={20} />
          </button>
        </form>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Today's Focus</h3>
          <p className={styles.cardText}>High Protein • Moderate Carbs</p>
        </div>
        <button className={styles.planBtn}>
          View Full Meal Plan <ChevronRight size={16} />
        </button>
      </div>
    </main>
  );
}
