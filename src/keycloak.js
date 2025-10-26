import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://13.204.9.221:8443/',       // Keycloak server URL
  realm: 'LEGAL_WING',                 // Your realm name
  clientId: 'legal-wing',          // Client ID for your client
});

export default keycloak;
