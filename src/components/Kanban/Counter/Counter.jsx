import React from 'react';
import styles from './Counter.module.css';
import DailyCounter from './DailyCounter/DailyCounter';
import WeeklyCounter from './WeeklyCounter/WeeklyCounter';
import BurndownRateCounter from './BurndownRateCounter/BurndownRateCounter';

const Counter = ({ dailyCards = [], weeklyScores = [] }) => (
  <div className={styles.counterRow}>
    <div className={styles.counterCol}>
      <DailyCounter completedCards={dailyCards} />
    </div>
    <div className={styles.counterCol}>
      <BurndownRateCounter completedCards={dailyCards} />
    </div>
    <div className={styles.counterCol}>
      <WeeklyCounter scoredCards={weeklyScores} />
    </div>
  </div>
);

export default Counter;
