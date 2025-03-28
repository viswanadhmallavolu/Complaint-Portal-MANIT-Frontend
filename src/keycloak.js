import Keycloak from "keycloak-js";

// Initialize Keycloak instance
const keycloak = new Keycloak({
	url: "http://localhost:8080/auth", // Update with your Keycloak server URL
	realm: "your-realm", // Update with your realm name
	clientId: "your-client-id", // Update with your client ID
});

// Add token refresh handling
keycloak.onTokenExpired = () => {
	console.log("Token expired, refreshing...");
	keycloak
		.updateToken(30)
		.then((refreshed) => {
			if (refreshed) {
				console.log("Token refreshed successfully");
				localStorage.setItem("token", keycloak.token);
			} else {
				console.log(
					"Token not refreshed, valid for " +
						Math.round(
							keycloak.tokenParsed.exp +
								keycloak.timeSkew -
								new Date().getTime() / 1000
						) +
						" seconds"
				);
			}
		})
		.catch(() => {
			console.error("Failed to refresh token");
		});
};

export default keycloak;
