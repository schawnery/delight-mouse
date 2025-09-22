import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import styles from './Column.module.css';
import Header from './Header/Header';

const Column = ({ header, tagText, columnId, cardIds, children }) => {
	const { isOver, setNodeRef } = useDroppable({ id: columnId });
	const columnStyle = {
		...((isOver) ? { background: '#e0ffe0', transition: 'background 0.2s' } : {}),
	};
	return (
		<div className={styles.column} ref={setNodeRef} style={columnStyle}>
			<Header title={header} tagText={tagText} colId={columnId} />
			<SortableContext id={columnId} items={cardIds} strategy={verticalListSortingStrategy}>
				<div className={styles['column-cards']}>
					{children}
				</div>
			</SortableContext>
		</div>
	);
};

Column.propTypes = {
	header: PropTypes.string.isRequired,
	tagText: PropTypes.node,
	children: PropTypes.node,
	columnId: PropTypes.string.isRequired,
	cardIds: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Column;
