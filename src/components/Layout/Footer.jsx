import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">LMW</span>
            </div>
            <span className="text-sm text-gray-600">LMW DataBase</span>
          </div>

          <div>
            <Link
              to="/sobre"
              className="text-sm text-gray-600 hover:text-indigo-600 hover:underline"
            >
              Sobre o Projeto
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} UTFPR - Universidade Tecnológica Federal do Paraná
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Plataforma de Estruturas Químicas Moleculares
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
