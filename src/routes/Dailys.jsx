import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLightbulb, FaClock, FaRedo } from 'react-icons/fa';
import Prompt from '../components/Prompt';
import Card from '../components/Card/Card';
import TextBox from '../components/TextBox/TextBox';
import '../styles/Home.css';

const Dailys = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  // Unified history for both generated prompts and textbox cards
  const [historyCards, setHistoryCards] = useState(() => {
    const stored = localStorage.getItem('dailys_historyCards');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    return localStorage.getItem('dailys_currentPrompt') || '';
  });
  const [textBoxValue, setTextBoxValue] = useState("");
  // Persist historyCards and currentPrompt to localStorage
  useEffect(() => {
    localStorage.setItem('dailys_historyCards', JSON.stringify(historyCards));
  }, [historyCards]);

  useEffect(() => {
    localStorage.setItem('dailys_currentPrompt', currentPrompt);
  }, [currentPrompt]);

  const prompts = [
    'Take a 5-minute walk.',
    'Drink a glass of water.',
    'Write down three things you are grateful for.',
    'Do 10 push-ups.',
    'Read a page from a book.'
  ];

  const handleGenerateChallenge = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    const timestamp = new Date().toLocaleString();
  setHistoryCards([{ prompt: randomPrompt, timestamp, type: 'generated' }, ...historyCards]);
  };

  const handleClearHistory = () => {
    setHistoryCards([]);
  };

  return (
    <div className="home-container">
      <header>
        <h1>Dailys Todo</h1>
        <p>Add more mundane shit to your shitlist</p>
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
            <Prompt prompt={currentPrompt} />
            <div style={{ marginTop: '2em', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextBox
                value={textBoxValue}
                onChange={e => setTextBoxValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (textBoxValue.trim()) {
                      const timestamp = new Date().toLocaleString();
                      setHistoryCards([{ prompt: textBoxValue.trim(), timestamp, type: 'textbox' }, ...historyCards]);
                      setTextBoxValue("");
                    }
                  }
                }}
                placeholder="Write your thoughts here... (press Enter to submit)"
                rows={4}
              />
            </div>
            <button className="generate-btn" onClick={handleGenerateChallenge}>
              <FaRedo className="icon-position" /> Generate
            </button>
          </div>
        )}
        {activeTab === 2 && (
          <div className="history-content">
            <div className="main-window-header">
              <h2>History</h2>
              <button className="clear-btn" onClick={handleClearHistory}>Clear</button>
            </div>
              {historyCards.map((card, idx) => (
                <li key={idx} className="history-card">
                  <Card>
                    <span>{card.prompt}</span>
                    <span className="timestamp">{card.timestamp}</span>
                  </Card>
                </li>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dailys;
