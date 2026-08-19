import { ROLE_ADMIN, SESSION_KEY } from './constants';

const session = {
  setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },
  getSession() {
    const rawSession = localStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession);
    } catch (error) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },
  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  },
  isAuthenticated() {
    const session = localStorage.getItem(SESSION_KEY);
    return !!session;
  },
  getToken() {
    const session = this.getSession();
    return session?.access_token ?? null;
  },
  isAdmin() {
    const session = this.getSession();
    return session?.user?.role === ROLE_ADMIN;
  },
};

export default session;
