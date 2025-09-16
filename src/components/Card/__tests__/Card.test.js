import Card from '../src/components/Card/Card';
import React from 'react';
import { render } from '@testing-library/react';

describe('Card', () => {
  it('renders children and className', () => {
    const { getByText } = render(
      <Card className="test-class">Hello World</Card>
    );
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
