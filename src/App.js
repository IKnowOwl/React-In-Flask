import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ImageApp } from './Pages/page'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p> Welcome to React-Flask App </p>
        <ImageApp />
      </header>
    </div>
  );
}

export default App;
