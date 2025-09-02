import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  // Set your major, minor, and atom versions here
  const MAJOR = 1;
  const MINOR = 1;
  const ATOM = 6;
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

export default Footer;
