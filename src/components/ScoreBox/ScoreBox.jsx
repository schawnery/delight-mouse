import React from 'react';
import styles from './ScoreBox.module.css';


const ScoreBox = ({ score }) => (
  <div className={styles['score-box']} aria-label="User score">
    <span className={styles['score-label']}>Score:</span>
    <span className={styles['score-value']}>{score.toFixed(2)}</span>
  </div>
);

export default ScoreBox;
