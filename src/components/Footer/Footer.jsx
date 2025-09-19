
import React, { useMemo } from 'react';
import './Footer.css';

const MAJOR = 1;
const MINOR = 2;
const ATOM = 2;

const Footer = () => {
  const version = useMemo(() => {
    const now = new Date();
    const DD = String(now.getDate()).padStart(2, '0');
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    return `${MAJOR}.${MINOR}.${ATOM}.${DD}.${MM}`;
  }, []);

  return (
    <footer className="footer" aria-label="Application footer">
      <p>Version: {version}</p>
    </footer>
  );
};

export default Footer;
