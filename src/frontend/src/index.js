import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import esEs from 'antd/locale/es_ES';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
    <ConfigProvider locale={esEs}>
    <App />  
    </ConfigProvider>
);
