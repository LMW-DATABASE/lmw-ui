// Validações para formulários
export const validators = {
  required: (value) => {
    return !value || !value.toString().trim() ? 'Este campo é obrigatório' : null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'E-mail inválido' : null;
  },

  minLength: (min) => (value) => {
    return value && value.length < min ? `Deve ter pelo menos ${min} caracteres` : null;
  },

  maxLength: (max) => (value) => {
    return value && value.length > max ? `Deve ter no máximo ${max} caracteres` : null;
  },

  passwordMatch: (confirmPassword, allValues) => {
    return confirmPassword !== allValues.senha ? 'Senhas não coincidem' : null;
  },

  strongPassword: (value) => {
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough) return 'Senha deve ter pelo menos 8 caracteres';
    if (!hasUpperCase) return 'Senha deve conter pelo menos uma letra maiúscula';
    if (!hasLowerCase) return 'Senha deve conter pelo menos uma letra minúscula';
    if (!hasNumbers) return 'Senha deve conter pelo menos um número';
    if (!hasSpecial) return 'Senha deve conter pelo menos um caractere especial';

    return null;
  }
};

// Função para combinar múltiplas validações
export const combineValidators = (...validatorFunctions) => {
  return (value, allValues) => {
    for (const validator of validatorFunctions) {
      const error = validator(value, allValues);
      if (error) return error;
    }
    return null;
  };
};

// Validações específicas para o projeto
export const cadastroValidators = {
  nome: combineValidators(validators.required, validators.minLength(2)),
  email: combineValidators(validators.required, validators.email),
  senha: combineValidators(validators.required, validators.minLength(6)),
  confirmarSenha: combineValidators(validators.required, validators.passwordMatch)
};