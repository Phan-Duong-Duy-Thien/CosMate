import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx' 
import {AuthPage} from './app/components/AuthPage.tsx'
import './index.css'
import 'antd/dist/reset.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthPage />
    </BrowserRouter>
  </React.StrictMode>
)
