import { create } from 'uc-dom';
import icon from 'uc-icon';

export default () => create('div.login.login-s-login', `
  <a class="login-close" href="#/done">${icon('close')}</a>
  <div class="login-login">
    <label class="input">
      <input tabindex=0 id="login-email" type="text">
      <span>Email</span>
      <em></em>
    </label>
    <a tabindex=1 href="#/login" class="login-button">Login</a>
  </div>
  <div class="login-done">
    <h2>Check your email for a login link</h2>
    <a href="#/done" class="login-button">Ok</a>
  </div>
`);
