import { trmrk, domUtils, bsDomUtils, vdom, webStorage } from './common/main.js';
import { app } from './app.js';

domUtils.onDomContentLoaded(app.init.bind(app));

// app.init();