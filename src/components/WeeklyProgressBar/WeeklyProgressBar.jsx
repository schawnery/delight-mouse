import React, { useEffect, useState } from 'react';
import './WeeklyProgressBar.css';

// SVG Icon as a component
const MultiplierIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="multiplier-icon">
    <circle cx="12" cy="12" r="10" stroke="#E57373" strokeWidth="2" fill="#FFF3E0"/>
    <path d="M12 7v5l3 3" stroke="#E57373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MS_PER_HOUR = 3600000;
const MS_PER_MIN = 60000;
const MS_PER_SEC = 1000;

function getWeekProgress() {
  const now = new Date();
  const day = now.getDay();
  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() - day);
  lastSunday.setHours(12, 0, 0, 0);
  if (day === 0 && now.getHours() < 12) lastSunday.setDate(lastSunday.getDate() - 7);
  const nextSunday = new Date(lastSunday);
  nextSunday.setDate(lastSunday.getDate() + 7);

  const total = nextSunday - lastSunday;
  const elapsed = now - lastSunday;
  const progress = Math.min(Math.max(elapsed / total, 0), 1);
  const multiplier = 1 - 0.5 * progress;
  const msLeft = nextSunday - now;
  const hours = Math.floor(msLeft / MS_PER_HOUR);
  const minutes = Math.floor((msLeft % MS_PER_HOUR) / MS_PER_MIN);
  const seconds = Math.floor((msLeft % MS_PER_MIN) / MS_PER_SEC);

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

  const { percent, multiplier, hours, minutes, seconds } = week;

  return (
    <div className="weekly-progress-card" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="weekly-progress-header">
        <div className="weekly-progress-header-left">
          <MultiplierIcon />
          <span className="weekly-progress-title">Weekly Progress</span>
          <span className="weekly-progress-percent">{percent}% complete</span>
        </div>
        <div className="weekly-progress-header-right">
          <span className="weekly-progress-multiplier">
            <MultiplierIcon />
            <span>{multiplier.toFixed(1)}x</span>
          </span>
          <span className="weekly-progress-timeleft">{hours}h {minutes}m {seconds}s left</span>
        </div>
      </div>
      <div className="weekly-progress-bar-bg">
        <div className="weekly-progress-bar-fill" style={{width: `${percent}%`}} />
      </div>
      <div className="weekly-progress-desc">
        Score multiplier decreases as the week progresses (Resets weekly on Sunday afternoons). Complete tasks early and chained together for maximum points!
      </div>
    </div>
  );
};

export default WeeklyProgressBar;
