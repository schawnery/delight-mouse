import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './WeeklyProgressBar.css';

// Helper to get current week progress (Sunday noon to next Sunday noon)
function getWeekProgress() {
  const now = new Date();
  const day = now.getDay();
  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() - day);
  lastSunday.setHours(12, 0, 0, 0);
  // If today is Sunday and before noon, use previous week's Sunday noon
  if (day === 0 && now.getHours() < 12) {
    lastSunday.setDate(lastSunday.getDate() - 7);
  }
  // Find next Sunday noon
  const nextSunday = new Date(lastSunday);
  nextSunday.setDate(lastSunday.getDate() + 7);
  // Progress (0 to 1)
  const total = nextSunday - lastSunday;
  const elapsed = now - lastSunday;
  const progress = Math.min(Math.max(elapsed / total, 0), 1);
  // Multiplier: 1.0 at start, 0.5 at end (linear)
  const multiplier = 1 - 0.5 * progress;
  // Time left
  const msLeft = nextSunday - now;
  const hours = Math.floor(msLeft / 3600000);
  const minutes = Math.floor((msLeft % 3600000) / 60000);
  const seconds = Math.floor((msLeft % 60000) / 1000);
  return {
    progress,
    multiplier,
    hours,
    minutes,
    seconds,
    percent: (progress * 100).toFixed(1),
  };
}

const WeeklyProgressBar = () => {
  const [week, setWeek] = useState(getWeekProgress());
  useEffect(() => {
    const timer = setInterval(() => setWeek(getWeekProgress()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="weekly-progress-card">
      <div className="weekly-progress-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span className="weekly-progress-title" style={{fontWeight: 300, fontSize: '1rem', marginRight: '12px', color: '#2d2d2d'}}>⏰ Weekly Progress</span>
          <span className="weekly-progress-percent" style={{fontWeight: 300, fontSize: '1rem', color: '#2d2d2d'}}>{week.percent}% complete</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span className="weekly-progress-multiplier" style={{display: 'flex', alignItems: 'center', marginRight: '12px', fontWeight: 300, fontFamily: 'inherit', fontSize: '1rem'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '4px', verticalAlign: 'middle'}}><circle cx="12" cy="12" r="10" stroke="#E57373" strokeWidth="2" fill="#FFF3E0"/><path d="M12 7v5l3 3" stroke="#E57373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{color:'#c53', fontWeight: 300, fontFamily: 'inherit', fontSize: '1rem'}}>{week.multiplier.toFixed(1)}x</span>
          </span>
          <span className="weekly-progress-timeleft" style={{fontWeight: 300, fontFamily: 'inherit', color: '#2d2d2d', fontSize: '1rem'}}>{week.hours}h {week.minutes}m {week.seconds}s left</span>
        </div>
      </div>
      <div className="weekly-progress-bar-bg">
        <div className="weekly-progress-bar-fill" style={{width: `${week.percent}%`}} />
      </div>
      <div className="weekly-progress-desc" style={{textAlign: 'left', marginTop: '8px', fontWeight: 300, fontSize: '0.95rem', color: '#444'}}>
        Score multiplier decreases as the week progresses (Resets weekly on Sunday afternoons). Complete tasks early and chained together for maximum points! 
      </div>
    </div>
  );
};

WeeklyProgressBar.propTypes = {};
export default WeeklyProgressBar;
