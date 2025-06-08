import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',       // Keycloak server URL
  realm: 'legal-wing',                 // Your realm name
  clientId: 'legal-wing',          // Client ID for your client
});

export default keycloak;
