//load constants and depdendencies
import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import { FaRedo, FaTrash, FaPlus } from 'react-icons/fa';

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { STORAGE_KEYS, COLUMNS, PROMPTS, WIP_LIMIT, QUEUED_LIMIT} from '../constants/kanban';
import { getStoredData, saveToStorage, generateTimestamp } from '../utils/storage';

// load components
import WeeklyProgressBar from '../components/WeeklyProgressBar/WeeklyProgressBar';
// import ScoreBox from '../components/ScoreBox/ScoreBox';
import TextBox from '../components/TextBox/TextBox';
import EditableCard from '../components/Card/EditableCard';
import Modal from '../components/Modal/Modal';
import Column from '../components/Kanban/Column/Column';
import Board from '../components/Kanban/Board/Board';
import DropZone from '../components/Kanban/DropZone';
import DraggableCard from '../components/Kanban/DraggableCard';
import '../styles/Home.css';
import DragCard from '../components/Card/DragCard/DragCard';



/**
 * Play - Main Kanban board route for daily challenges and tasks.
 * Features:
 *   - Card creation, editing, drag-and-drop between columns
 *   - LocalStorage persistence
 *   - Challenge prompt generation
 *   - Character limits and counters
 */
const Play = () => {
  return (
    <div className="home-container">
      <WeeklyProgressBar />
      <Board>
        <Column header="Test Column">
          <DragCard 
            title="Test Card" 
            description="This is a test card in the new column." 
            value={42} 
          />
        </Column>
        <Column header="Test Column 2">
          <DragCard 
            title="Test Card" 
            description="This is a test card in the new column." 
            value={42} 
          />
        </Column>
        <Column header="Test Column 3">
          <DragCard 
            title="Test Card" 
            description="This is a test card in the new column." 
            value={42} 
          />
        </Column>
      </Board>
    </div>
  );
};

export default Play;