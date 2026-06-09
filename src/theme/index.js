export const THEME_STORAGE_KEY = 'lmw-theme';

export const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const getStoredTheme = () => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === 'dark' ? 'dark' : 'light';
};

export const initTheme = () => {
  applyTheme(getStoredTheme());
};
