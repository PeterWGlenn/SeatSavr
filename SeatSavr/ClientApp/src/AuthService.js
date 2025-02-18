﻿import auth0 from 'auth0-js';
import { AUTH0_CONFIG } from './Auth0Config';

export default class AuthService {
    auth0 = new auth0.WebAuth({
        domain: AUTH0_CONFIG.domain,
        clientID: AUTH0_CONFIG.clientID,
        redirectUri: AUTH0_CONFIG.redirectUri,
        //audience: AUTH_CONFIG.audience,
        responseType: 'token id_token',
        scope: 'openid'
    });

    login() {
        this.auth0.authorize();
    }

    handleAuthentication(history) {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                history.push("/");
            } else if (err) {
                console.log(err);
            }
        });
    }

    setSession(authResult) {
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    isAuthenticated() {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        window.location.href = '/home';
    }
}