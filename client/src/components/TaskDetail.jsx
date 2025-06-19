import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaSave, FaTrashAlt, FaTimes, FaCheckCircle, FaTag } from 'react-icons/fa';
import { updateTask, deleteTask } from '../api/tasks';
import './TaskDetail.css';

function TaskDetail() {
  const task = useLoaderData();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    complete: task.complete,
    tags: task.tags || []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateTask(task.id, formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsSubmitting(true);
      try {
        await deleteTask(task.id);
        navigate('/');
      } catch (err) {
        setError(err.message);
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="task-detail-container">
      <h2>Edit Task</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter task description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags (press Enter)"
            />
            <button
              type="button"
              className="add-tag-button"
              onClick={() => addTag(tagInput.trim())}
            >
              <FaTag /> Add
            </button>
          </div>
          <div className="tags-container">
            {formData.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button
                  type="button"
                  className="remove-tag"
                  onClick={() => removeTag(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="complete"
            name="complete"
            checked={formData.complete}
            onChange={handleChange}
          />
          <label htmlFor="complete">
            <FaCheckCircle /> Mark as complete
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
          >
            <FaSave /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="button danger"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            <FaTrashAlt /> Delete Task
          </button>
          <Link to="/" className="button secondary">
            <FaTimes /> Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default TaskDetail; 