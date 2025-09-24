import React from 'react';
import styles from './BurndownRateCounter.module.css';
import { FaFire } from 'react-icons/fa';

/**
 * BurndownRateCounter
 * Shows the average time (in hours and minutes) between card completions.
 * Expects completedCards: array of card objects with completedAt timestamps.
 */
function getAverageTimeBetweenCompletions(completedCards = []) {
  // Only consider cards with completedAt
  const sorted = completedCards
    .filter(card => card.completedAt)
    .map(card => new Date(card.completedAt).getTime())
    .sort((a, b) => a - b);
  if (sorted.length < 2) return null;
  const intervals = [];
  for (let i = 1; i < sorted.length; i++) {
    intervals.push(sorted[i] - sorted[i - 1]);
  }
  const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const hours = Math.floor(avgMs / 3600000);
  const minutes = Math.floor((avgMs % 3600000) / 60000);
  return { hours, minutes };
}

const BurndownRateCounter = ({ completedCards = [] }) => {
  const avg = getAverageTimeBetweenCompletions(completedCards);
  return (
    <div className={styles.burndownRateBox}>
      <div className={styles.burndownRateHeader}>
        <FaFire className={styles.fireIcon} />
        Avg. Pace
        <span className={styles.infoIcon} title="Average time between card completions">&#9432;</span>
      </div>
      <div className={styles.burndownRateText}>
        {avg ? (
          <>{avg.hours}h {avg.minutes}m</>
        ) : (
          <>Not enough completions <span role="img" aria-label="hourglass">⏳</span></>
        )}
      </div>
    </div>
  );
};

export default BurndownRateCounter;
