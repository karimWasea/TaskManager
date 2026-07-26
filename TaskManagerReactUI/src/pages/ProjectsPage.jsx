import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.createProject(formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      loadProjects();
    } catch (err) {
      setFormError(err.message || 'Failed to create project');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(id);
        loadProjects();
      } catch (err) {
        alert(err.message || 'Failed to delete project');
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + New Project
        </button>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          className="form-control search-input" 
          placeholder="Search projects by name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="empty-state text-danger">{error}</div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? 'No projects found matching your search.' : 'No projects yet. Create one to get started!'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="card clickable"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="card-header">
                <h3 className="card-title">{project.name}</h3>
                <button 
                  className="btn-icon text-danger" 
                  onClick={(e) => handleDelete(e, project.id)}
                  title="Delete Project"
                >
                  &#128465;
                </button>
              </div>
              <div className="card-body">
                {project.description || 'No description provided.'}
              </div>
              <div className="card-footer">
                <span>Tasks: {project.taskCount || 0}</span>
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject}>
          {formError && <div className="text-danger mb-4 text-sm">{formError}</div>}
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-control" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <div className="flex justify-between" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Project</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
