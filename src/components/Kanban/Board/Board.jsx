import React from 'react';
import { DndContext } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import styles from './Board.module.css';

function findColumnByCardId(columns, cardId) {
	return Object.values(columns).find(col => col.cardIds.includes(cardId));
}

const Board = ({ children, columns, setColumns, onCardComplete }) => {
	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || !active) return;
		const activeId = active.id;
		const overId = over.id;

		// Find source and destination columns
		const sourceCol = findColumnByCardId(columns, activeId);
		const destCol = findColumnByCardId(columns, overId) || columns[overId];
		if (!sourceCol) return;

		// Enforce WIP limit for In Progress column
		if (destCol && destCol.id === 'In Progress' && destCol.cardIds.length >= 3 && sourceCol.id !== destCol.id) {
			// Prevent moving card into In Progress if limit reached
			return;
		}

		// If dropped in same column, reorder
		if (sourceCol && destCol && sourceCol.id === destCol.id) {
			const oldIdx = sourceCol.cardIds.indexOf(activeId);
			const newIdx = sourceCol.cardIds.indexOf(overId);
			if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
				const newCardIds = [...sourceCol.cardIds];
				newCardIds.splice(oldIdx, 1);
				newCardIds.splice(newIdx, 0, activeId);
				setColumns({
					...columns,
					[sourceCol.id]: { ...sourceCol, cardIds: newCardIds }
				});
			}
			} else if (sourceCol && destCol && sourceCol.id !== destCol.id) {
				// Move card to another column
				const oldIdx = sourceCol.cardIds.indexOf(activeId);
				if (oldIdx === -1) return;
				const newIdx = overId && destCol.cardIds.indexOf(overId) !== -1 ? destCol.cardIds.indexOf(overId) : destCol.cardIds.length;
				const newSourceCardIds = [...sourceCol.cardIds];
				newSourceCardIds.splice(oldIdx, 1);
				const newDestCardIds = [...destCol.cardIds];
				newDestCardIds.splice(newIdx, 0, activeId);
				setColumns({
					...columns,
					[sourceCol.id]: { ...sourceCol, cardIds: newSourceCardIds },
					[destCol.id]: { ...destCol, cardIds: newDestCardIds }
				});
				// If card moved to Completed, call onCardComplete
				if (destCol.id === 'Completed' && typeof onCardComplete === 'function') {
					onCardComplete(activeId);
				}
			}
	};

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div className={styles.board}>
				{children}
			</div>
		</DndContext>
	);
};

Board.propTypes = {
	children: PropTypes.node,
	columns: PropTypes.object.isRequired,
	setColumns: PropTypes.func.isRequired,
	onCardComplete: PropTypes.func
};

export default Board;
