import { ready, get, on } from 'uc-dom';
import app from 'uc-app';
import Login from './index';

ready(() => {
  app.setAPI({
    app: app => console.log('Set App', app),
    auth: {
      name: 'user',
      login: (req, cb) => {
        console.log('Auth request', req);
        setTimeout(() => cb(new Error('No no no')), 1000);
      },
      token: token => console.log('Auth token', token)
    }
  })

  const body = get('body').item(0);
  const login = new Login({
    container: body,
    hotkey: 'ctrl+l'
  });

  on(get('#click'), 'click', () => login.show())
  // setTimeout(() => input.remove(), 5000);
});
