import PropTypes from 'prop-types';
import styles from './Header.module.css';
// Color maps for columns and tags
const columnBg = {
	'Queued': '#ffe89c',
	'In Progress': '#b6ffe3',
	'Completed': '#a9d6fd',
};
const tagBg = {
	'Queued': '#ffd600',
	'In Progress': '#00c853',
	'Completed': '#6099fc',
};

const Header = ({ title, tagText, colId }) => (
	<div
		className={styles.header}
		style={{
			background: columnBg[colId],
		}}
	>
		<span className={styles.title}>{title}</span>
		{tagText && (
			<span
				className={styles.tag}
				style={{
					background: tagBg[colId]
				}}
			>
				{tagText}
			</span>
		)}
	</div>
);

Header.propTypes = {
	title: PropTypes.string.isRequired,
	tagText: PropTypes.node,
	colId: PropTypes.string.isRequired,
};

export default Header;
