import Prompt from '../src/components/Prompt';
import React from 'react';
import { render } from '@testing-library/react';

describe('Prompt', () => {
  it('renders prompt text', () => {
    const { getByText } = render(<Prompt text="Test prompt" />);
    expect(getByText('Test prompt')).toBeInTheDocument();
  });
});
