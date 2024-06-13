import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChatBotLogo from '../Images/ChatBotLogo.png';
import OracleLogo from '../Images/OracleLogo.png';

// Componente para mostrar cada tarea
function TaskItem({ task, onClick }) {
  return (
    <div className={`task-item ${task.priority.toLowerCase()}`} onClick={onClick}>
      <h3>{task.name}</h3>
      <p>Due on {task.due_date}</p>
    </div>
  );
}

// Componente principal de la pantalla de inicio
function HomeScreen({ username }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '', due_date: '', priority: 'low' });
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async (userEmail) => {
      try {
        const userTasksSnapshot = await getDocs(collection(firestore, 'tasks', userEmail, 'user_tasks'));
        const userTasks = userTasksSnapshot.docs.map(taskDoc => ({ id: taskDoc.id, ...taskDoc.data() }));
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Error fetching tasks');
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTasks(user.email);
      }
    });
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddTask = async () => {
    try {
      const user = auth.currentUser;
      const docRef = await addDoc(collection(firestore, 'tasks', user.email, 'user_tasks'), newTask);
      setTasks([...tasks, { id: docRef.id, ...newTask }]);
      setNewTask({ name: '', description: '', due_date: '', priority: 'low' });
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async () => {
    try {
      const user = auth.currentUser;
      await updateDoc(doc(firestore, 'tasks', user.email, 'user_tasks', selectedTask.id), selectedTask);
      setTasks(tasks.map(task => task.id === selectedTask.id ? selectedTask : task));
      setSelectedTask(null);
      setShowEditTaskModal(false);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const user = auth.currentUser;
      await deleteDoc(doc(firestore, 'tasks', user.email, 'user_tasks', selectedTask.id));
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      setSelectedTask(null);
      setShowDeleteTaskModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handlePriorityChange = (priority) => {
    setNewTask({ ...newTask, priority });
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setNewTask({ ...newTask, due_date: date.toISOString().split('T')[0] });
  };

  return (
    <div className={`home-screen ${darkMode ? 'dark-mode' : ''}`}>
      <div className="banner">
        <img src={ChatBotLogo} alt="ChatBot Logo" className="banner-logo" />
        <img src={OracleLogo} alt="Oracle Logo" className="banner-logo" />
      </div>
      <h1 className="welcome-text">
        Bienvenido a la página de inicio para USUARIO <span role="img" aria-label="user">👤</span>
      </h1>
      <p className="welcome-subtext">¡Has iniciado sesión correctamente, {username}!</p>
      <div className="toggle-container">
        <label className="switch">
          <input type="checkbox" onChange={toggleDarkMode} />
          <span className="slider"></span>
        </label>
        <span>{darkMode ? 'Modo Oscuro' : 'Modo Claro'}</span>
      </div>
      <h2>Tus Tareas
        <button onClick={() => setShowAddTaskModal(true)} className="task-action-button">➕</button>
        <button onClick={() => setShowEditTaskModal(true)} className="task-action-button">✏️</button>
        <button onClick={() => setShowDeleteTaskModal(true)} className="task-action-button">🗑</button>
      </h2>
      {error && <p className="error">{error}</p>}
      {tasks.length === 0 ? (
        <p>No tienes tareas.</p>
      ) : (
        tasks.map((task, index) => (
          <TaskItem key={index} task={task} onClick={() => setSelectedTask(task)} />
        ))
      )}
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onRequestClose={() => setSelectedTask(null)}
          contentLabel="Task Description"
          className="modal"
          overlayClassName="overlay"
        >
          <button className="close-button" onClick={() => setSelectedTask(null)}>×</button>
          <h2>{selectedTask.name}</h2>
          <p>Due on {selectedTask.due_date}</p>
          <p>{selectedTask.description}</p>
        </Modal>
      )}
      <Modal
        isOpen={showAddTaskModal}
        onRequestClose={() => setShowAddTaskModal(false)}
        contentLabel="Add Task"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Agregar Tarea</h2>
        <input type="text" name="name" value={newTask.name} onChange={handleInputChange} placeholder="Nombre de la Tarea" />
        <textarea name="description" value={newTask.description} onChange={handleInputChange} placeholder="Descripción de la Tarea"></textarea>
        <DatePicker selected={startDate} onChange={handleDateChange} />
        <div className="priority-buttons">
          <button type="button" className={`priority-button low ${newTask.priority === 'low' ? 'selected' : ''}`} onClick={() => handlePriorityChange('low')}>Low</button>
          <button type="button" className={`priority-button medium ${newTask.priority === 'medium' ? 'selected' : ''}`} onClick={() => handlePriorityChange('medium')}>Medium</button>
          <button type="button" className={`priority-button high ${newTask.priority === 'high' ? 'selected' : ''}`} onClick={() => handlePriorityChange('high')}>High</button>
        </div>
        <button className="task-action-button" onClick={handleAddTask}>Agregar Tarea</button>
      </Modal>
      <Modal
        isOpen={showEditTaskModal}
        onRequestClose={() => setShowEditTaskModal(false)}
        contentLabel="Edit Task"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Editar Tarea</h2>
        <select onChange={e => setSelectedTask(tasks.find(task => task.id === e.target.value))} value={selectedTask ? selectedTask.id : ''}>
          <option value="">Seleccionar Tarea</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>{task.name}</option>
          ))}
        </select>
        {selectedTask && (
          <>
            <input type="text" name="name" value={selectedTask.name} onChange={e => setSelectedTask({ ...selectedTask, name: e.target.value })} placeholder="Nombre de la Tarea" />
            <textarea name="description" value={selectedTask.description} onChange={e => setSelectedTask({ ...selectedTask, description: e.target.value })} placeholder="Descripción de la Tarea"></textarea>
            <DatePicker selected={new Date(selectedTask.due_date)} onChange={date => setSelectedTask({ ...selectedTask, due_date: date.toISOString().split('T')[0] })} />
            <div className="priority-buttons">
              <button type="button" className={`priority-button low ${selectedTask.priority === 'low' ? 'selected' : ''}`} onClick={() => setSelectedTask({ ...selectedTask, priority: 'low' })}>Low</button>
              <button type="button" className={`priority-button medium ${selectedTask.priority === 'medium' ? 'selected' : ''}`} onClick={() => setSelectedTask({ ...selectedTask, priority: 'medium' })}>Medium</button>
              <button type="button" className={`priority-button high ${selectedTask.priority === 'high' ? 'selected' : ''}`} onClick={() => setSelectedTask({ ...selectedTask, priority: 'high' })}>High</button>
            </div>
            <button className="task-action-button" onClick={handleEditTask}>Guardar Cambios</button>
          </>
        )}
      </Modal>
      <Modal
        isOpen={showDeleteTaskModal}
        onRequestClose={() => setShowDeleteTaskModal(false)}
        contentLabel="Delete Task"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Eliminar Tarea</h2>
        <select onChange={e => setSelectedTask(tasks.find(task => task.id === e.target.value))} value={selectedTask ? selectedTask.id : ''}>
          <option value="">Seleccionar Tarea</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>{task.name}</option>
          ))}
        </select>
        {selectedTask && (
          <>
            <p>{selectedTask.name}</p>
            <button className="task-action-button" onClick={handleDeleteTask}>Eliminar</button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default HomeScreen;

// CSS en el mismo archivo
const styles = `
.home-screen {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
}

.banner {
  background-color: #f5f5f5;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.banner-logo {
  width: 160px;
  height: 90px;
  margin: 0 16px;
}

.welcome-text {
  font-size: 2em;
  color: #ff5722;
  transition: transform 0.2s ease-in-out;
  text-align: center;
}

.welcome-text:hover {
  transform: scale(1.05);
}

.welcome-subtext {
  font-size: 1.2em;
  color: #28a745;
  text-align: center;
  margin-bottom: 20px;
}

.error {
  color: red;
  margin-top: 16px;
}

.task-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.task-item:hover {
  transform: scale(1.02);
}

.task-item.low {
  border-left: 4px solid #4caf50;
}

.task-item.medium {
  border-left: 4px solid #ffeb3b;
}

.task-item.high {
  border-left: 4px solid #f44336;
}

.task-item h3 {
  margin: 0;
  font-size: 1.25em;
}

.task-item p {
  margin: 0.5em 0;
}

.modal {
  position: relative;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: red; /* Color rojo para la "X" */
}

.task-actions {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.task-action-button {
  padding: 10px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.task-action-button:hover {
  background-color: #0056b3;
}

.task-form {
  margin-bottom: 20px;
}

.task-form input,
.task-form textarea,
.task-form select {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.priority-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.priority-button {
  padding: 10px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  color: white;
  border-radius: 5px;
}

.priority-button.low {
  background-color: #4caf50;
}

.priority-button.medium {
  background-color: #ffeb3b;
  color: #333;
}

.priority-button.high {
  background-color: #f44336;
}

.priority-button.selected {
  transform: scale(1.1);
}

.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-mode .banner {
  background-color: #1f1f1f;
}

.dark-mode .task-item {
  background-color: #1f1f1f;
  border: 1px solid #333;
}

.dark-mode .task-item.low {
  border-left: 4px solid #4caf50;
}

.dark-mode .task-item.medium {
  border-left: 4px solid #ffeb3b;
}

.dark-mode .task-item.high {
  border-left: 4px solid #f44336;
}

.toggle-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
  margin-right: 10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  border-radius: 50%;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(14px);
}
`;

// Insertar los estilos en el documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
