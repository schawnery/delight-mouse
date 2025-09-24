import React from 'react';
import styles from './DailyCounter.module.css';
import { FaBolt } from 'react-icons/fa';

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

const DailyCounter = ({ completedCards = [] }) => {
  // completedCards: array of card objects with a completedAt date
  const { start, end } = getTodayRange();
  const todayCount = completedCards.filter(card => {
    if (!card.completedAt) return false;
    const date = new Date(card.completedAt);
    return date >= start && date <= end;
  }).length;

  return (
    <div className={styles.dailyCounterBox}>
      <div className={styles.dailyCounterHeader}>
        <FaBolt className={styles.boltIcon} />
        Today <span className={styles.infoIcon} title="Cards completed from 12:00 AM to 11:59 PM" >&#9432;</span>
      </div>
      <div className={styles.dailyCounterText}>
        {todayCount === 0 ? (
          <>Let's start! <span role="img" aria-label="flex">💪</span></>
        ) : (
          <>{todayCount} Card{todayCount > 1 ? 's' : ''}</>
        )}
      </div>
    </div>
  );
};

export default DailyCounter;
