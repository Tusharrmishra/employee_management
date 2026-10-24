import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom'
import App from './App';import {StoreProvider} from './context/Store';import './index.css'
createRoot(document.getElementById('root')).render(<StoreProvider><BrowserRouter><App/></BrowserRouter></StoreProvider>)
