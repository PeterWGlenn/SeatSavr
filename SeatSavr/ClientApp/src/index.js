import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Loading from "./components/loading";
import LayoutDraw from "./components/LayoutDraw"
import styles from "./styles/styles.css"

import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0ProviderWithHistory } from "./auth0-provider-with-history";


ReactDOM.render(
    <Router>
        <Auth0ProviderWithHistory>
            <App>
                <LayoutDraw />
             </App> 
        </Auth0ProviderWithHistory>
    </Router>,
    document.getElementById('root')
 );
export { Loading };

