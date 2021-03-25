import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Auth0Provider } from "@auth0/auth0-react"
import { AUTH_CONFIG } from "./Auth0Config"

//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
//const rootElement = document.getElementById('root');

const onRedirectCallback = appstate => {
    window.history.replaceState(
        {},
        document.title,
        appstate && appstate.targetUri
            ? appstate.targetUri
            : window.location.pathname
    );
};


ReactDOM.render(
    <Auth0Provider
        domain={AUTH_CONFIG.domain}
        client_id={AUTH_CONFIG.clientId}
        redirect_uri={AUTH_CONFIG.redirectUri}
        onRedirectCallback={onRedirectCallback}
    >
        <BrowserRouter>

            <App />
        </BrowserRouter>
    </Auth0Provider>,
    document.getElementById('root')
 );

registerServiceWorker();

