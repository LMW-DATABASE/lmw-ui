import i18n from '@/i18n';

// Validações para formulários
export const validators = {
  required: (value) => {
    return !value || !value.toString().trim() ? i18n.t('validators:required') : null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? i18n.t('validators:email') : null;
  },

  minLength: (min) => (value) => {
    return value && value.length < min ? i18n.t('validators:minLength', { min }) : null;
  },

  maxLength: (max) => (value) => {
    return value && value.length > max ? i18n.t('validators:maxLength', { max }) : null;
  },

  passwordMatch: (confirmPassword, allValues) => {
    return confirmPassword !== allValues.senha ? i18n.t('validators:passwordMismatch') : null;
  },

  strongPassword: (value) => {
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough) return i18n.t('validators:passwordMinLength');
    if (!hasUpperCase) return i18n.t('validators:passwordUppercase');
    if (!hasLowerCase) return i18n.t('validators:passwordLowercase');
    if (!hasNumbers) return i18n.t('validators:passwordNumber');
    if (!hasSpecial) return i18n.t('validators:passwordSpecial');

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
