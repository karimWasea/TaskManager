import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="navbar">
          <Link to="/" className="navbar-brand">Task Manager</Link>
          <nav className="navbar-nav">
            <Link to="/" className="nav-link">Projects</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
