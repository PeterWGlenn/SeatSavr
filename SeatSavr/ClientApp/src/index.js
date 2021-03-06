import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history"


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
    <Router>
        <Auth0ProviderWithHistory>
            <App />
        </Auth0ProviderWithHistory>
    </Router>,

  rootElement);

registerServiceWorker();

