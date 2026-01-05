// Mock Keycloak for local development
export const useKeycloak = () => {
  return {
    keycloak: {
      token: 'mock-token',
      authenticated: true,
      logout: () => {
        // Clear any stored data
        localStorage.clear();
        sessionStorage.clear();
        // Redirect to login or home page
        window.location.href = '/login';
      },
      tokenParsed: {
        preferred_username: 'testuser',
        given_name: 'Test',
        family_name: 'User',
      },
    },
    initialized: true,
  };
};
