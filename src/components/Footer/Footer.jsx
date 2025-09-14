import React from 'react';
import PropTypes from 'prop-types';
import './Footer.css';

const Footer = () => {
  // Set your major, minor, and atom versions here
  const MAJOR = 1;
  const MINOR = 2;
  const ATOM = 15;
  const now = new Date();
  const DD = String(now.getDate()).padStart(2, '0');
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const version = `${MAJOR}.${MINOR}.${ATOM}.${DD}.${MM}`;
  return (
    <footer className="footer">
      <p>Version: {version}</p>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;
