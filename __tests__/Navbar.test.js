import Navbar from '../src/components/Navbar/Navbar';
import React from 'react';
import { render } from '@testing-library/react';

describe('Navbar', () => {
  it('renders navigation buttons', () => {
    const { getByText } = render(<Navbar />);
    expect(getByText('Dailys')).toBeInTheDocument();
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('About')).toBeInTheDocument();
  });
});
