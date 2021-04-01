import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Loading from "./components/loading";

//import { Auth0Provider } from "@auth0/auth0-react"
//import { AUTH_CONFIG } from "./Auth0Config"
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0ProviderWithHistory } from "./auth0-provider-with-history";

//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
//const rootElement = document.getElementById('root');



ReactDOM.render(
    <Router>
        <Auth0ProviderWithHistory>
            <App/>
        </Auth0ProviderWithHistory>
    </Router>,
    document.getElementById('root')
 );

//registerServiceWorker();
export { Loading };

