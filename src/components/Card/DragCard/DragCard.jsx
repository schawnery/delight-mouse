import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './DragCard.module.css';

const DragCard = ({ title, description, initialTag = '', value = 0 }) => {
	const [userTag, setUserTag] = useState(initialTag);

	return (
		<div className={styles["drag-card"]}>
			<div className={styles["drag-card-header"]}>
				<h3>{title}</h3>
			</div>
			<div className={styles["drag-card-body"]}>
				<p>{description}</p>
			</div>
			<div className={styles["drag-card-tags"]}>
				<input
					type="text"
					className={styles["drag-card-tag-input"]}
					value={userTag}
					onChange={e => setUserTag(e.target.value)}
					placeholder="Enter tag"
				/>
				<span className={styles["drag-card-value-tag"]}>{value}</span>
			</div>
		</div>
	);
};

DragCard.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	initialTag: PropTypes.string,
	value: PropTypes.number
};

export default DragCard;