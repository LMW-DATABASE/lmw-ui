import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoutes.jsx';
import { Home, Login, Dashboard, SobrePage } from './pages';
import ListagemMoleculas from '@/pages/ListagemMoleculas.jsx';
import MoleculeDetailsPage from '@/pages/MoleculeDetailsPage.jsx';
import EditMolecule from '@/pages/EditMolecule.jsx';

const NotFound = () => {
  const { t } = useTranslation('common');
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('notFoundTitle')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('notFoundMessage')}</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/molecules/:id" element={<MoleculeDetailsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/moleculas" element={<ListagemMoleculas />} />
            <Route path="/moleculas/edit/:id" element={<EditMolecule />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
