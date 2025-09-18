import React from 'react';
import PropTypes from 'prop-types';
import styles from './Column.module.css';
import Header from './Header/Header';

const Column = ({ header, children }) => (
		<div className={styles.column}>
			<Header title={header} />
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
