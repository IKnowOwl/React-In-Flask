import {createAuthProvider} from 'react-token-auth';


export const [useAuth, authFetch, login, logout] =
    createAuthProvider({
        accessTokenKey: 'access_token',
        onUpdateToken: (token) => fetch('https://floating-waters-03184.herokuapp.com/api/refresh', {
            method: 'POST',
            body: token.access_token
        })
        .then(r => r.json())
    });

