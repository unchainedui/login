# Unchained UI

## Login

[![NPM Version](https://img.shields.io/npm/v/uc-login.svg?style=flat-square)](https://www.npmjs.com/package/uc-login)
[![NPM Downloads](https://img.shields.io/npm/dt/uc-login.svg?style=flat-square)](https://www.npmjs.com/package/uc-login)

Login screen

### Usage

```js
import Login from 'uc-login';

const login = new Login({
  container: document.body,
  hotkey: 'ctrl+l'
});

```

Default options are used in the example above.

**The api in the app must have auth controller.**


### Methods

#### show([err])

Show the login screen. If `err` is provide the `err.message` will be shown.

#### hide()

Hides the login screen.

License MIT

© velocityzen

