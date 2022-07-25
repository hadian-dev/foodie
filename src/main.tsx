import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import firebaseApp from './firebase';
import './index.css';

firebaseApp.auth.onAuthStateChanged((user) => {
  if (user) {
    console.log({ user });
  } else {
    console.log('Failed to Authenticate');
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
