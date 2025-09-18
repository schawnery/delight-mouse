import React from 'react';
import PropTypes from 'prop-types';
import styles from './Header.module.css';

const Header = ({ title, children }) => (
	<div className={styles.header}>
		<span className={styles.title}>{title}</span>
		{children && <span className={styles.tag}>{children}</span>}
	</div>
);

Header.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node
};

export default Header;
