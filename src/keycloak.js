import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://13.204.9.221:8080/',       // Keycloak server URL
  realm: 'LEGAL_WING',                 // Your realm name
  clientId: 'legal-wing',          // Client ID for your client
});

export default keycloak;
