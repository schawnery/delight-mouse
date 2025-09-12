import Footer from '../src/components/Footer/Footer';
import React from 'react';
import { render } from '@testing-library/react';

describe('Footer', () => {
  it('renders version text', () => {
    const { getByText } = render(<Footer />);
    expect(getByText(/Version:/)).toBeInTheDocument();
  });
});
