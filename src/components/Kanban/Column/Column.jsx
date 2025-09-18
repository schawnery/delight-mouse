import React from 'react';
import PropTypes from 'prop-types';
import styles from './Column.module.css';

const Column = ({ header, children }) => (
	<div className={styles.column}>
		<div className={styles['column-header']}>
			{header}
		</div>
		<div className={styles['column-cards']}>
			{children}
		</div>
	</div>
);

Column.propTypes = {
	header: PropTypes.node.isRequired,
	children: PropTypes.node
};

export default Column;
