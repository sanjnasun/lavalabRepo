import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import TallyApp from './TallyApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TallyApp />
  </StrictMode>,
)
