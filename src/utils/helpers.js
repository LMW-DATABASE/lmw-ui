// Formatadores de dados
export const formatters = {
  // Formatar CPF
  cpf: (value) => {
    if (!value) return value;
    const cleanValue = value.replace(/\D/g, '');
    const match = cleanValue.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return value;
  },

  // Formatar telefone
  phone: (value) => {
    if (!value) return value;
    const cleanValue = value.replace(/\D/g, '');
    const match = cleanValue.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  },

  // Formatar CEP
  cep: (value) => {
    if (!value) return value;
    const cleanValue = value.replace(/\D/g, '');
    const match = cleanValue.match(/^(\d{5})(\d{3})$/);
    if (match) {
      return `${match[1]}-${match[2]}`;
    }
    return value;
  },

  // Capitalizar primeira letra de cada palavra
  capitalize: (value) => {
    if (!value) return value;
    return value.toLowerCase().replace(/\b\w/g, (match) => match.toUpperCase());
  }
};

// Utilitários gerais
export const utils = {
  // Remover caracteres especiais deixando apenas números
  onlyNumbers: (value) => {
    return value ? value.replace(/\D/g, '') : '';
  },

  // Gerar ID único simples
  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  },

  // Debounce para otimizar buscas
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Verificar se é dispositivo móvel
  isMobile: () => {
    return window.innerWidth <= 768;
  },

  // Copiar texto para clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  },

  // Formatar data para exibição
  formatDate: (date, locale = 'pt-BR') => {
    return new Date(date).toLocaleDateString(locale);
  },

  // Truncar texto
  truncateText: (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }
};

// Constantes do projeto
export const constants = {
  API_BASE_URL: 'http://localhost:3001/api',
  APP_NAME: 'EDNU-LMW',
  ORGANIZATION: 'UTFPR',
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  
  // Cores do tema
  COLORS: {
    primary: '#4F46E5', // indigo-600
    secondary: '#6366F1', // indigo-500
    success: '#10B981', // emerald-500
    warning: '#F59E0B', // amber-500
    error: '#EF4444', // red-500
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      500: '#6B7280',
      900: '#111827'
    }
  },

  // Breakpoints para responsividade
  BREAKPOINTS: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
};

// Handlers de erro
export const errorHandlers = {
  // Handler genérico para erros de API
  apiError: (error) => {
    if (error.response) {
      // Erro do servidor
      return error.response.data?.message || 'Erro interno do servidor';
    } else if (error.request) {
      // Erro de rede
      return 'Erro de conexão. Verifique sua internet.';
    } else {
      // Erro desconhecido
      return 'Erro inesperado. Tente novamente.';
    }
  },

  // Handler específico para erros de autenticação
  authError: (error) => {
    if (error.response?.status === 401) {
      return 'Credenciais inválidas';
    } else if (error.response?.status === 403) {
      return 'Acesso negado';
    } else {
      return errorHandlers.apiError(error);
    }
  }
};