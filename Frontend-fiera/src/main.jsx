import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CatalogProvider } from './context/CatalogContext';
import Home from './pages/home/home';
import Layout from './layout/layout';
import Catalog from './pages/catalog/Catalog';
import ProtectedAdmin from './admin/protected-admin/ProtectedAdmin';
import DashboardAdmin from './admin/dashboard_admin';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CatalogProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
        </Route>
      </Routes>
    </CatalogProvider>
  </BrowserRouter>
);
