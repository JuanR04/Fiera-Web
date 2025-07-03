import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Layout from './layout/layout';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Layout >
    <Routes>
      <Route index path="/" element={<Home />}/>
    </Routes>
    </Layout>
  </BrowserRouter>
);
