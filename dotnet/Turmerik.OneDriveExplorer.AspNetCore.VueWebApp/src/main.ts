import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

import AppContentComponent from "./components/AppContentComponent.vue";
import { registerRoutes, allComponents } from "./routes";
import {
  registerComponents,
  registerServices,
  trmrkBootstrapApp,
} from "./components";

const app = createApp(App);

app.provide("trmrkBootstrapApp", trmrkBootstrapApp);
registerServices(app);

registerComponents(app, allComponents);
app.component("AppContentComponent", AppContentComponent);

registerRoutes(app);
app.mount("#app");
