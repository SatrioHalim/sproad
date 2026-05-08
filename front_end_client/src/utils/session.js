const TOKEN_KEY = 'my-token';

const session = {
  setSession(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getSession() {
    return localStorage.getItem(TOKEN_KEY);
  },
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
  },
  isAuthenticated() {
    const session = localStorage.getItem(TOKEN_KEY);
    return !!session;
  },
};

export default session;
