import React from 'react';
import PropTypes from 'prop-types';

const Prompt = ({ text }) => {
  return <p className="prompt-text">{text}</p>;
};

Prompt.propTypes = {
  text: PropTypes.string.isRequired
};

export default Prompt;
