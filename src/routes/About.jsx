
import React from 'react';


const editorialStyles = {
  padding: '2rem 1rem 4rem 1rem',
  maxWidth: '700px',
  margin: '3.5rem auto 0 auto', // push down by navbar height
  fontFamily: 'inherit',
  color: '#222',
  textAlign: 'left',
};

const headingStyles = {
  fontSize: '1.5rem',
  fontWeight: 500,
  marginBottom: '1.1rem',
  color: '#222',
  textAlign: 'left',
};

const sectionTitle = {
  fontSize: '1.05rem',
  fontWeight: 500,
  margin: '1.5rem 0 0.5rem 0',
  color: '#333',
  textAlign: 'left',
};

const About = () => (
  <div className="about-container" style={editorialStyles}>
    <h1 style={headingStyles}>About Glyph-1</h1>
    <p style={{ fontSize: '0.98rem', fontWeight: 400, marginBottom: '1.2rem', color: '#444', lineHeight: '1.7', textAlign: 'left' }}>
      <strong>Glyph-1</strong> is a productivity and habit-tracking tool that helps you organize daily tasks, build routines, and track progress using a Kanban-style workflow. It makes daily productivity fun and simple by combining challenge generation, habit tracking, and a Kanban board to help you stay on top of your goals.
    </p>

    <div style={sectionTitle}>Key Features</div>
  <ul style={{ margin: '0 0 1.2rem 0.6rem', paddingLeft: '1em', fontSize: '0.95rem', fontWeight: 400, lineHeight: '1.6', color: '#333', textAlign: 'left' }}>
      <li><strong>Kanban Workflow:</strong> Organize your tasks using columns: <em>Queued</em>, <em>In Progress</em> (with a Work-In-Progress limit), <em>Completed</em> (finished tasks earn you points), and <em>History</em> (log of all generated and completed challenges).</li>
      <li><strong>Drag-and-Drop Cards:</strong> Move tasks between columns using drag-and-drop. You can also create, edit, and delete cards.</li>
      <li><strong>Score System:</strong> Completing tasks early in the week earns you a higher score, thanks to a weekly multiplier that decays as the week progresses.</li>
      <li><strong>Local Storage Persistence:</strong> All your data is saved locally in your browser, so your progress is preserved between sessions.</li>
      </ul>

    <div style={sectionTitle}>How to Use</div>
  <ol style={{ margin: '0 0 1.2rem 0.6rem', paddingLeft: '1em', fontSize: '0.95rem', fontWeight: 400, lineHeight: '1.6', color: '#333', textAlign: 'left' }}>
      <li><strong>Manage Tasks:</strong> On the Play page, add new cards for your own tasks, move them through the workflow, and mark them as completed.</li>
      <li><strong>Track Progress:</strong> The Weekly Progress Bar shows how far you are through the week and your current score multiplier.</li>
      <li><strong>Customize Cards:</strong> Edit card details, add tags, and organize your workflow to suit your needs.</li>
    </ol>

    <div style={sectionTitle}>Technology</div>
  <ul style={{ margin: '0 0 1.2rem 0.6rem', paddingLeft: '1em', fontSize: '0.95rem', fontWeight: 400, lineHeight: '1.6', color: '#333', textAlign: 'left' }}>
      <li>Built with <strong>React</strong> and <strong>Vite</strong> for fast performance.</li>
      <li>Uses <strong>react-dnd</strong> for drag-and-drop.</li>
      <li>All styles are custom and responsive.</li>
      <li>Open source under the MIT license.</li>
    </ul>

    <div style={{ marginTop: '2rem', fontSize: '0.92rem', color: '#666', textAlign: 'left', fontWeight: 400 }}>
      Made by <strong>schawnery</strong>. Open source on GitHub.
    </div>
  </div>
);

export default About;
