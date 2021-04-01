import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { AUTH0_CONFIG } from "./Auth0Config";
import { useHistory } from "react-router-dom";

export const Auth0ProviderWithHistory = ({ children }) => {
    const domain = AUTH0_CONFIG.domain;
    const clientId = AUTH0_CONFIG.clientID;
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
}

