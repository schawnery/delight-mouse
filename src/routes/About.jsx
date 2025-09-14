
import React from 'react';
import '../styles/About.css';



const About = () => (
  <div className="about-container">
    <h1 className="about-heading">About Glyph-1</h1>
    <p className="about-paragraph">
      <strong>Glyph-1</strong> is a productivity and habit-tracking tool that helps you organize daily tasks, build routines, and track progress using a Kanban-style workflow. It makes daily productivity fun and simple by combining challenge generation, habit tracking, and a Kanban board to help you stay on top of your goals.
    </p>

    <div className="about-section-title">Key Features</div>
    <ul className="about-list">
      <li><strong>Kanban Workflow:</strong> Organize your tasks using columns: <em>Queued</em>, <em>In Progress</em> (with a Work-In-Progress limit), <em>Completed</em> (finished tasks earn you points), and <em>History</em> (log of all generated and completed challenges).</li>
      <li><strong>Drag-and-Drop Cards:</strong> Move tasks between columns using drag-and-drop. You can also create, edit, and delete cards.</li>
      <li><strong>Score System:</strong> Completing tasks early in the week earns you a higher score, thanks to a weekly multiplier that decays as the week progresses.</li>
      <li><strong>Local Storage Persistence:</strong> All your data is saved locally in your browser, so your progress is preserved between sessions.</li>
    </ul>

    <div className="about-section-title">How to Use</div>
    <ol className="about-ol">
      <li><strong>Manage Tasks:</strong> On the Play page, add new cards for your own tasks, move them through the workflow, and mark them as completed.</li>
      <li><strong>Track Progress:</strong> The Weekly Progress Bar shows how far you are through the week and your current score multiplier.</li>
      <li><strong>Customize Cards:</strong> Edit card details, add tags, and organize your workflow to suit your needs.</li>
    </ol>

    <div className="about-section-title">Technology</div>
    <ul className="about-tech-list">
      <li>Built with <strong>React</strong> and <strong>Vite</strong> for fast performance.</li>
      <li>Uses <strong>react-dnd</strong> for drag-and-drop.</li>
      <li>All styles are custom and responsive.</li>
      <li>Open source under the MIT license.</li>
    </ul>

    <div className="about-footer">
      Made by <strong>schawnery</strong>. Open source on GitHub.
    </div>
  </div>
);

export default About;
