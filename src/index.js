import App from 'components/App.js';
import Style from '../src/style.css';
import Normalize from '../src/normalize.css';

const $app = document.querySelector('#app');

console.log(process.env.NODE_ENV);

new App({ $target: $app });
