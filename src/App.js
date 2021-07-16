import React, { Component } from 'react';
import IDE from './components/IDE.js';
import { Router, Link } from "@reach/router";


function App() {

  return (
    <Router>
      <IDE path="/" />
    </Router>
    
  );
}

export default App;
