import React, { useEffect, useState } from 'react';
import { BsGraphDownArrow } from 'react-icons/bs';
import { FaRegClock } from 'react-icons/fa';
import styles from './WeeklyProgressBar.module.css';
import ScoreBox from '../ScoreBox/ScoreBox';

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
  // Exponential decay: starts at 2x, drops off harder as week progresses
  const multiplier = 2 * Math.exp(-1.0 * progress);
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


const WeeklyProgressBar = ({ score, lastPointsEarned }) => {
  const [week, setWeek] = useState(getWeekProgress());

  useEffect(() => {
    const timer = setInterval(() => setWeek(getWeekProgress()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { percent, multiplier, hours, minutes, seconds, progress } = week;

  // Multiplier color logic
  let multiplierColor = '#22c55e'; // green
  if (progress >= 0.66666) {
    multiplierColor = '#e53935'; // red
  } else if (progress >= 0.33333) {
    multiplierColor = '#ff9800'; // orange
  }

  return (
    <div className={styles['weekly-progress-card']} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles['weekly-progress-header']}>
        <div className={styles['weekly-progress-header-left']}>
          <FaRegClock style={{ color: '#2d2d2d', fontSize: '18px', verticalAlign: 'middle' }} />
          <span className={styles['weekly-progress-title']}>Weekly Progress</span>
          <span className={styles['weekly-progress-percent']}>{percent}% complete</span>
        </div>
        <div className={styles['weekly-progress-header-right']}>
          <span className={styles['weekly-progress-multiplier']} style={{ color: multiplierColor }}>
            <BsGraphDownArrow style={{ fontSize: '16px', verticalAlign: 'middle' }} />
            <span>{multiplier.toFixed(1)}x</span>
          </span>
          <span className={styles['weekly-progress-timeleft']}>{hours}h {minutes}m {seconds}s left</span>
        </div>
      </div>
      <div className={styles['weekly-progress-bar-bg']}>
        <div className={styles['weekly-progress-bar-fill']} style={{width: `${percent}%`}} />
      </div>
      <div className={styles['weekly-progress-desc']}>
        Score multiplier decreases as the week progresses (Resets weekly on Sunday afternoons). Complete tasks early and chained together for maximum points!
      </div>
      
      {typeof score === 'number' && (
        <div className={styles['score-card']}>
          <div className={styles['score-card-header']}>
            <span className={styles['score-card-title']}>
              <span role="img" aria-label="trophy" className={styles['score-card-trophy']}>🏆</span>
              Score
            </span>
            {typeof score === 'number' && score > 0 && (
              <span className={styles['score-card-rapid-bonus']}>
                ⚡ Rapid Bonus!
              </span>
            )}
          </div>
          <div className={styles['score-card-value']}>{Math.floor(score)}</div>
          <div className={styles['score-card-multiplier-row']}>
            <div className={styles['score-card-multiplier-weekly']}>
              {typeof multiplier === 'number' ? multiplier.toFixed(1) : '1.0'}x
              <span className={styles['score-card-multiplier-label']}>Weekly</span>
            </div>
            <div className={styles['score-card-multiplier-rapid']}>
              {typeof score === 'number' && score > 0 ? (score / multiplier).toFixed(1) : '1.0'}x
              <span className={styles['score-card-multiplier-label']}>Rapid</span>
            </div>
          </div>
          <div className={styles['score-card-desc']}>
            Complete tasks rapidly for bonus multipliers!
          </div>
        </div>
      )}
      
    </div>
  );
};

export default WeeklyProgressBar;
