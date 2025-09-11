import React from 'react';

const About = () => (
  <div className="about-container" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
    <h1>About this app</h1>
    <p>
      Glyph-1 is a simple productivity and habit-tracking app designed to help you organize your daily tasks and routines. 
      Add cards, move them through your workflow, and keep track of your progress. 
      Built with React and Vite, Glyph-1 is fast, responsive, and easy to use.
    </p>
    <p>
      Features:
      <ul style={{ textAlign: 'left', margin: '1rem auto', display: 'inline-block' }}>
        <li>Daily challenge generation</li>
        <li>Kanban-style workflow columns</li>
        <li>Drag-and-drop card management</li>
        <li>Local storage persistence</li>
        <li>Responsive design for desktop and mobile</li>
      </ul>
    </p>
    <p>
      Made by schawnery. Open source on GitHub.
    </p>
  </div>
);

export default About;
