import isHotkey from 'is-hotkey/src/index.js';
import compose from 'uc-compose';
import form from 'uc-form';
import { on, off } from 'uc-dom';
import html from 'uc-dom/methods';
import app from 'uc-app';
import Input from 'uc-input-field';
import template from './template';

const Login = function(opts = {}) {
  if (!app.api.auth) {
    throw new Error('No auth controller defined')
  }

  this.on = {};

  this.elContainer = opts.container || document.body;
  this.isHotkey = isHotkey(opts.hotkey || 'ctrl+l');
  this.onLogout();

  app.on('app.route.login', this.onToken, this);
  const authName = app.api.auth.name;
  app.on(`${authName}.in`, this.onLogin, this);
  app.on(`${authName}.out`, this.onLogout, this);
};

Login.prototype = compose(
  html,
  form,
  {
    onToken: function(state) {
      app.api.auth.authenticate(state.token, err => {
        console.log('auth', err);
        if (err) {
          this.show(err);
        }
      });
    },

    show: function(err) {
      if (this.isActive) {
        return;
      }

      this.isActive = true;
      this.el = template();
      this.addForm();
      this.input = new Input({
        el: this.find('.input').item(0)
      });

      if (err) {
        this.input.error(err.message);
      }

      this.appendTo(this.elContainer);
      setTimeout(() => {
        this.addClass('active');
        this.input.focus();
      }, 32);
    },

    hide: function() {
      if (!this.isActive) {
        return;
      }

      this.isActive = false;
      this.removeClass('active');
      setTimeout(() => {
        this.removeForm();
        this.input.remove();
        this.input = null;
        this.el.remove();
        this.el = null;
      }, 600);
    },

    remove: function() {
      this.hide();
      off(document, 'keydown', this.on.hotkey);
      app.off('app.route.login', this.onToken, this);
      const authName = app.api.auth.name;
      app.off(`${authName}.in`, this.onLogin, this);
      app.off(`${authName}.out`, this.onLogout, this);
    },

    onLogin: function() {
      off(document, 'keydown', this.on.hotkey);
      this.hide();
    },

    onLogout: function() {
      this.on.hotkey = on(document, 'keydown', e => this.isHotkey(e) && this.show());
    },

    login: function() {
      if (this.request) {
        return;
      }

      this.addClass('login-s-progress');
      this.request = app.api.auth.login({
        email: this.input.value(),
        data: {
          redirect: window.location.href
        }
      }, err => {
        this.request = null;
        this.removeClass('login-s-progress', 'login-s-login', 'login-s-done');
        if (err) {
          this.input.error(err.message);
          this.addClass('login-s-login');
          return;
        }

        this.input.value('');
        this.addClass('login-s-done');
      });
    },

    done: function() {
      this.hide();
    },

    // keys
    '13': function() {
      this.login();
    },

    '27': function() {
      this.isActive && this.hide();
    }
  }
);

export default Login;
