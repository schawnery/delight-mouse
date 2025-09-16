import TextBox from '../src/components/TextBox/TextBox';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

describe('TextBox', () => {
  it('renders with value and placeholder', () => {
    const { getByPlaceholderText } = render(
      <TextBox value="abc" onChange={() => {}} placeholder="Type here" />
    );
    expect(getByPlaceholderText('Type here').value).toBe('abc');
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    const { getByPlaceholderText } = render(
      <TextBox value="" onChange={handleChange} placeholder="Type here" />
    );
    fireEvent.change(getByPlaceholderText('Type here'), { target: { value: 'x' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
