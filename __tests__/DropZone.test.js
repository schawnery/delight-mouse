import DropZone from '../src/components/Kanban/DropZone';
import React from 'react';
import { render } from '@testing-library/react';

describe('DropZone', () => {
  it('renders children', () => {
    const { getByText } = render(
      <DropZone>Drop here</DropZone>
    );
    expect(getByText('Drop here')).toBeInTheDocument();
  });
});
