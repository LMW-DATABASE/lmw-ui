import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; // 1. Importe o useAuth

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Pegue a função de login do contexto
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name] || errors.submit) {
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // 3. Chame a função de login do contexto
    const result = await login(formData.email, formData.senha);

    if (result.success) {
      navigate('/dashboard'); // Redireciona em caso de sucesso
    } else {
      setErrors({ submit: result.error }); // Mostra o erro em caso de falha
    }

    setLoading(false);
  };

  // O resto do seu JSX continua igual...
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center"><span className="text-white font-bold text-xl">LMW</span></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Entrar</h2>
          <p className="mt-2 text-sm text-gray-600">LMW DataBase - Plataforma UTFPR</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{errors.submit}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Digite seu e-mail"/>
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.senha ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Digite sua senha"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Esqueceu a senha?{' '}
              <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">Recuperar senha</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

