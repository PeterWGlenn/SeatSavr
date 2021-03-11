// src/auth/auth0-provider-with-history.js

import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import authconfig from "./authconfig.json"

const Auth0ProviderWithHistory = ({ children }) => {
    const domain = "dev-h03x6nz6.us.auth0.com";
    const clientId = "5nsvjGuVj765f50rW6tBPQevHdM1aP9C";

    const history = useHistory();

    const onRedirectCallback = (appState) => {
        history.push(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;