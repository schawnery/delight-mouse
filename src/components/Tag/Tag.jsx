import React from 'react';
import styles from './Tag.module.css';

const Tag = ({ text }) => (
  <span className={styles.tag}>{text}</span>
);

export default Tag;
