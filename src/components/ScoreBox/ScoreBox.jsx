import React from 'react';
import './ScoreBox.css';


const ScoreBox = ({ score }) => (
  <div className="score-box" aria-label="User score">
    <span className="score-label">Score:</span>
    <span className="score-value">{score.toFixed(2)}</span>
  </div>
);

export default ScoreBox;
