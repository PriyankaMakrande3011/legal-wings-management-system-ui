// Mock Keycloak for development/testing
const mockKeycloak = {
  init: () => Promise.resolve(true),
  login: () => {},
  logout: () => {},
  register: () => {},
  accountManagement: () => {},
  createLoginUrl: () => '',
  createLogoutUrl: () => '',
  createRegisterUrl: () => '',
  createAccountUrl: () => '',
  isTokenExpired: () => false,
  updateToken: () => Promise.resolve(true),
  clearToken: () => {},
  hasRealmRole: () => true,
  hasResourceRole: () => true,
  loadUserProfile: () => Promise.resolve({}),
  loadUserInfo: () => Promise.resolve({}),
  authenticated: true,
  token: 'mock-token',
  tokenParsed: {
    sub: 'mock-user-id',
    preferred_username: 'mockuser',
    email: 'mock@example.com',
    realm_access: { roles: ['user'] },
    resource_access: {}
  },
  subject: 'mock-user-id',
  idToken: 'mock-id-token',
  idTokenParsed: {},
  realmAccess: { roles: ['user'] },
  resourceAccess: {},
  refreshToken: 'mock-refresh-token',
  refreshTokenParsed: {},
  timeSkew: 0,
  responseMode: 'fragment',
  responseType: 'code',
  flow: 'standard',
  realm: 'mock-realm',
  clientId: 'mock-client',
  authServerUrl: 'http://localhost:8080/auth'
};

export default mockKeycloak;
