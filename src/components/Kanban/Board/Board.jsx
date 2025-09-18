import React from 'react';
import PropTypes from 'prop-types';
import styles from './Board.module.css';

const Board = ({ children }) => (
	<div className={styles.board}>
		{children}
	</div>
);

Board.propTypes = {
	children: PropTypes.node
};

export default Board;
