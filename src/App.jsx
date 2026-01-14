import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importando componentes e páginas com caminhos relativos para corrigir o erro
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoutes.jsx';
import { Home, Login, Dashboard, SobrePage } from './pages';
import CadastroUsuarioModal from './components/Auth/CadastroUsuarioModal';
import ListagemMoleculas from '@/pages/ListagemMoleculas.jsx';
import MoleculeDetailsPage from '@/pages/MoleculeDetailsPage.jsx';

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/molecules/:id" element={<MoleculeDetailsPage />} />

          {/* --- Rotas Protegidas --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/moleculas" element={<ListagemMoleculas />} />
          </Route>

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
                <p className="text-gray-600">A página que você está procurando não existe.</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

