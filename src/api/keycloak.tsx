import Keycloak from 'keycloak-js';

// Create a singleton instance
const keycloakInstance = new Keycloak({
  url: "https://sso.manit.ac.in",
  realm: "ldapsso",
  clientId: "cmp"
});

// Store the initialization promise so that init is called only once.
let initPromise = null;

const initKeycloak = (options) => {
  if (!initPromise) {
    initPromise = keycloakInstance.init(options)
      .then((authenticated) => {
        console.log("Keycloak initialized:", authenticated);
        return authenticated;
      })
      .catch((err) => {
        console.error("Keycloak initialization error:", err);
        throw err;
      });
  }
  return initPromise;
};

export { keycloakInstance, initKeycloak };
