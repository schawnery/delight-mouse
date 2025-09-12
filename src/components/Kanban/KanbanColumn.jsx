import React from 'react';
import styles from './KanbanColumn.module.css';

const KanbanColumn = ({ title, cards, columnKey, children }) => (
  <main className={styles.kanbanColumn}>
    {children}
    <div className={styles.challengeContent}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <span className={styles.countPill}>{cards.length}</span>
      </div>
      <div className={styles.cardsWrapper}>
        {cards}
      </div>
    </div>
  </main>
);

export default KanbanColumn;
