import KanbanColumn from '../src/components/Kanban/KanbanColumn';
import React from 'react';
import { render } from '@testing-library/react';

describe('KanbanColumn', () => {
  it('renders title and cards', () => {
    const cards = [
      { prompt: 'Test Card', timestamp: '123', type: 'generated' }
    ];
    const { getByText } = render(
      <KanbanColumn title="Test Column" description="desc" cards={cards} columnKey="historyCards" />
    );
    expect(getByText('Test Column')).toBeInTheDocument();
    expect(getByText('Test Card')).toBeInTheDocument();
  });
});
