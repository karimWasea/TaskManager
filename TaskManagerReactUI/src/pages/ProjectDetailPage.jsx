import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Project Edit State
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState({ name: '', description: '' });
  
  // Task Tabs
  const [activeTab, setActiveTab] = useState('All');
  
  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState({ id: null, title: '', description: '', status: 'ToDo', dueDate: '' });
  const [taskFormError, setTaskFormError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getProject(id);
      setProject(data);
      setProjectFormData({ name: data.name, description: data.description || '' });
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      try {
        await api.deleteProject(id);
        navigate('/');
      } catch (err) {
        alert(err.message || 'Failed to delete project');
      }
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await api.updateProject(id, projectFormData);
      setProject({ ...project, name: projectFormData.name, description: projectFormData.description });
      setIsEditingProject(false);
    } catch (err) {
      alert(err.message || 'Failed to update project');
    }
  };

  // Task Actions
  const handleOpenTaskModal = (task = null) => {
    setTaskFormError(null);
    if (task) {
      setTaskFormData({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setTaskFormData({ id: null, title: '', description: '', status: 'ToDo', dueDate: '' });
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setTaskFormError(null);
    try {
      const payload = {
        title: taskFormData.title,
        description: taskFormData.description,
        status: taskFormData.status,
        dueDate: taskFormData.dueDate ? new Date(taskFormData.dueDate).toISOString() : null,
        projectId: id
      };

      if (taskFormData.id) {
        await api.updateTask(taskFormData.id, payload);
      } else {
        await api.createTask(payload);
      }
      setIsTaskModalOpen(false);
      loadData(); // Refresh tasks
    } catch (err) {
      setTaskFormError(err.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(taskId);
        loadData();
      } catch (err) {
        alert(err.message || 'Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTaskStatus(taskId, newStatus);
      // Optimistic update
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert(err.message || 'Failed to update status');
      loadData(); // Revert on failure
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="empty-state text-danger">{error}</div>;
  if (!project) return <div className="empty-state">Project not found</div>;

  const filteredTasks = activeTab === 'All' ? tasks : tasks.filter(t => t.status === activeTab);
  
  const counts = {
    All: tasks.length,
    ToDo: tasks.filter(t => t.status === 'ToDo').length,
    InProgress: tasks.filter(t => t.status === 'InProgress').length,
    Done: tasks.filter(t => t.status === 'Done').length,
  };

  return (
    <div>
      <div className="mb-4">
        <Link to="/" className="text-sm text-secondary">← Back to Projects</Link>
      </div>

      <div className="project-detail-header">
        {isEditingProject ? (
          <form onSubmit={handleUpdateProject} className="inline-edit-form">
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={projectFormData.name}
                onChange={e => setProjectFormData({...projectFormData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control" 
                value={projectFormData.description}
                onChange={e => setProjectFormData({...projectFormData, description: e.target.value})}
              ></textarea>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditingProject(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between align-center mb-4">
              <h1 style={{ margin: 0 }}>{project.name}</h1>
              <div className="flex gap-2">
                <button className="btn btn-secondary" onClick={() => setIsEditingProject(true)}>Edit</button>
                <button className="btn btn-danger" onClick={handleDeleteProject}>Delete</button>
              </div>
            </div>
            <p className="text-secondary mb-2">{project.description || 'No description provided.'}</p>
            <div className="text-sm text-secondary">
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between align-center mb-6">
        <h2 style={{ margin: 0 }}>Tasks</h2>
        <button className="btn btn-primary" onClick={() => handleOpenTaskModal()}>
          + Add Task
        </button>
      </div>

      <div className="tabs">
        {['All', 'ToDo', 'InProgress', 'Done'].map(tab => (
          <button 
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'ToDo' ? 'To Do' : tab === 'InProgress' ? 'In Progress' : tab}
            <span className="tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">No tasks found in this category.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <div key={task.id} className={`card task-card status-${task.status}`}>
              <div className="card-header">
                <h4 className="card-title" style={{ fontSize: '1rem', fontWeight: 600 }}>{task.title}</h4>
                <div className="flex gap-2">
                  <button className="btn-icon edit-icon" onClick={() => handleOpenTaskModal(task)}>✎</button>
                  <button className="btn-icon text-danger" onClick={() => handleDeleteTask(task.id)}>&#128465;</button>
                </div>
              </div>
              <div className="card-body" style={{ minHeight: '3rem' }}>
                {task.description || <span style={{ opacity: 0.5 }}>No description</span>}
              </div>
              <div className="flex justify-between align-center mt-4">
                <select 
                  className="form-control" 
                  style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="ToDo">To Do</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                {task.dueDate && (
                  <span className="text-sm text-secondary" style={{ fontSize: '0.75rem' }}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        title={taskFormData.id ? "Edit Task" : "Add New Task"}
      >
        <form onSubmit={handleSaveTask}>
          {taskFormError && <div className="text-danger mb-4 text-sm">{taskFormError}</div>}
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={taskFormData.title}
              onChange={e => setTaskFormData({...taskFormData, title: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-control" 
              value={taskFormData.description}
              onChange={e => setTaskFormData({...taskFormData, description: e.target.value})}
            ></textarea>
          </div>
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Status</label>
              <select 
                className="form-control"
                value={taskFormData.status}
                onChange={e => setTaskFormData({...taskFormData, status: e.target.value})}
              >
                <option value="ToDo">To Do</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={taskFormData.dueDate}
                onChange={e => setTaskFormData({...taskFormData, dueDate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-between" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{taskFormData.id ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
