import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLightbulb, FaClock, FaRedo } from 'react-icons/fa';
import Prompt from '../components/Prompt';
import Card from '../components/Card/Card';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [historyCards, setHistoryCards] = useState(() => {
    const stored = localStorage.getItem('historyCards');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    return localStorage.getItem('currentPrompt') || '';
  });
  // Persist historyCards and currentPrompt to localStorage
  useEffect(() => {
    localStorage.setItem('historyCards', JSON.stringify(historyCards));
  }, [historyCards]);

  useEffect(() => {
    localStorage.setItem('currentPrompt', currentPrompt);
  }, [currentPrompt]);

  const prompts = [
    'Take a 5-minute walk.',
    'Drink a glass of water.',
    'Write down three things you are grateful for.',
    'Do 10 push-ups.',
    'Read a page from a book.',
    'Do 20 squats.',
    'Stand up and reset your posture.',
    'Step away from screens for 5 minutes',
    'Write down your top priority for the next two days.'
  ];

  const handleGenerateChallenge = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    const timestamp = new Date().toLocaleString();
    setHistoryCards([{ prompt: randomPrompt, timestamp }, ...historyCards]);
  };

  const handleClearHistory = () => {
    setHistoryCards([]);
  };

  return (
    <div className="home-container">
      <header>
        <h1>Daily Challenge Generator</h1>
        <p>Hit the button to add stuff to your daily routine</p>
      </header>
      <div className="tabs-container">
        <div className="tabs-wrapper">
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              <FaLightbulb className="icon-position" /> Current challenge
            </button>
            <button 
              className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => setActiveTab(2)}
            >
              <FaClock className="icon-position" /> History ({historyCards.length})
            </button>
          </div>
        </div>
      </div>
      <main className="main-window">
        {activeTab === 1 && (
          <div className="challenge-content">
            <div className="main-window-header">
              <h2>Your challenge</h2>
              <p>Generate your daily challenge!</p>
            </div>
            {currentPrompt ? (
              <Prompt text={currentPrompt} />
            ) : (
              <div className="prompt-text zero-state"></div>
            )}
            <button className="generate-button" onClick={handleGenerateChallenge}>
              <FaRedo className="icon-position" /> Generate Challenge
            </button>
          </div>
        )}
        {activeTab === 2 && (
          <div className="history-content">
            <div className="main-window-header">
              <div>
                <h2>Challenge history</h2>
                <p>You've completed ({historyCards.length}) challenges!</p>
              </div>
              <button className="clear-history-button" onClick={handleClearHistory}>Clear History</button>
            </div>
            <div className="cards-wrapper">
              {historyCards.map((card, index) => (
                <Card key={index}>
                  <p>{card.prompt}</p>
                  <span className="card-timestamp">{card.timestamp}</span>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
