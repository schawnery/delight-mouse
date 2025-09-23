import React from 'react';
import styles from './WeeklyCounter.module.css';
import { FaCalendarWeek } from 'react-icons/fa';

// Helper to get the start of the current week (Sunday 12:00 AM)
function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day, 0, 0, 0, 0);
  return start;
}

/**
 * WeeklyCounter
 * @param {Array} scoredCards - Array of objects: { scoredAt: date, score: number }
 */
const WeeklyCounter = ({ scoredCards = [] }) => {
  const weekStart = getWeekStart();
  // Only include cards scored this week
  const weeklyTotal = scoredCards
    .filter(card => card.scoredAt && new Date(card.scoredAt) >= weekStart)
    .reduce((sum, card) => sum + (card.score || 0), 0);

  return (
    <div className={styles.weeklyCounterBox}>
      <div className={styles.weeklyCounterHeader}>
        <FaCalendarWeek className={styles.calendarIcon} />
        This Week
      </div>
      <div className={styles.weeklyCounterText}>
        <strong>{weeklyTotal === 0 ? "Let's start! " : weeklyTotal + ' Points'}</strong>
        {weeklyTotal === 0 && <span role="img" aria-label="flex">💪</span>}
      </div>
    </div>
  );
};

export default WeeklyCounter;
