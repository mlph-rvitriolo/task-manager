import { useLoaderData, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaEdit, FaCheckCircle, FaRegCircle, FaPlus, FaTag } from 'react-icons/fa';
import { updateTask } from '../api/tasks';
import './TaskList.css';

function TaskList() {
  const initialTasks = useLoaderData();
  const [tasks, setTasks] = useState(initialTasks);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const completeFilter = searchParams.get('complete');
  
  let statusText = 'All Tasks';
  if (completeFilter === 'true') {
    statusText = 'Completed Tasks';
  } else if (completeFilter === 'false') {
    statusText = 'Open Tasks';
  }

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, complete: !task.complete };
      await updateTask(task.id, updatedTask);
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === task.id ? updatedTask : t)
      );
      
      // If we're on a filtered view and the task no longer matches the filter, refresh
      if (completeFilter !== null && String(updatedTask.complete) !== completeFilter) {
        // Short delay to show the change before refreshing
        setTimeout(() => {
          navigate(window.location.pathname + window.location.search);
        }, 300);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Filter tasks based on the current view (if needed)
  const displayedTasks = tasks.filter(task => {
    if (completeFilter === null) return true;
    return String(task.complete) === completeFilter;
  });

  return (
    <div className="task-list-container">
      <h2>{statusText}</h2>
      
      {displayedTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task to get started!</p>
        </div>
      ) : (
        <ul className="task-list">
          {displayedTasks.map(task => (
            <li key={task.id} className={`task-item ${task.complete ? 'complete' : ''}`}>
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                {task.tags && task.tags.length > 0 && (
                  <div className="task-tags">
                    {task.tags.map(tag => (
                      <span key={tag} className="tag">
                        <FaTag /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="task-actions">
                <button
                  className={`task-toggle ${task.complete ? 'complete' : ''}`}
                  onClick={() => handleToggleComplete(task)}
                >
                  {task.complete ? <FaCheckCircle /> : <FaRegCircle />}
                  {task.complete ? 'Completed' : 'Mark Complete'}
                </button>
                <Link to={`/detail/${task.id}`} className="button">
                  <FaEdit /> Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <Link to="/add" className="button add-task-button">
        <FaPlus /> Add New Task
      </Link>
    </div>
  );
}

export default TaskList; 