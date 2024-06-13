import React, { useState } from 'react';
import './App.css';
import ChatbotLogo from './Images/ChatBotLogo.png';
import OracleLogo from './Images/OracleLogo.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import HomeScreen from './Screens/homeScreen';
import HomeScreenManager from './Screens/homeScreenManager';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [username, setUsername] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userExists = await checkUserExists(user.uid);

      if (!userExists) {
        await createUserDocument(user.uid, user.email);
      }

      const username = user.email.split('@')[0];
      setUsername(username);

      await checkIsManager(user.uid);

      setLoggedIn(true);
    } catch (error) {
      setError('Correo o contraseña incorrectos');
      console.error('Error al iniciar sesión:', error.message);
    }
  };

  const checkUserExists = async (uid) => {
    try {
      const docRef = doc(firestore, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error al verificar si el usuario ya está registrado:', error.message);
      return false;
    }
  };

  const createUserDocument = async (uid, email) => {
    try {
      await setDoc(doc(firestore, 'usuarios', uid), {
        correo: email,
        password: password,  // Agrega la contraseña al documento de usuario
        isManager: false // Cambia esto según la lógica de tu aplicación
      });
    } catch (error) {
      console.error('Error al crear documento de usuario en Firestore:', error.message);
    }
  };

  const checkIsManager = async (uid) => {
    try {
      const docRef = doc(firestore, 'usuarios', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.isManager === true) {
          setIsManager(true);
        }
      }
    } catch (error) {
      console.error('Error al verificar si el usuario es un manager:', error.message);
    }
  };

  if (loggedIn) {
    if (isManager) {
      return <HomeScreenManager username={username} />;
    } else {
      return <HomeScreen username={username} />;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={ChatbotLogo} className="App-logo" alt="Chatbot Logo" />
        <form onSubmit={handleSubmit} className="App-form">
          <h2>Inicio de Sesión</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <label>
            Correo:
            <input type="email" value={email} onChange={handleEmailChange} required />
          </label>
          <label>
            Contraseña:
            <input type="password" value={password} onChange={handlePasswordChange} required />
          </label>
          <button type="submit">Iniciar Sesión</button>
        </form>
        <img src={OracleLogo} className="Oracle-logo" alt="Oracle Logo" />
      </header>
    </div>
  );
}

export default App;
