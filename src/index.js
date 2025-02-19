import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import { router } from './Routes/Routes';
import "./i18n";
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Register the service worker
serviceWorkerRegistration.register();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback={null}>
    <React.StrictMode>
    <RouterProvider router={router} />
    </React.StrictMode>
  </Suspense>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
