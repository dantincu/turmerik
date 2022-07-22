import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

import { registerRoutes, allComponents } from "./appSetup/RegisterRoutes";
import { registerComponents, registerServices } from "./appSetup/MapComponents";
import { trmrkBootstrapApp } from "./appSetup/MapComponentsCore";

import AppContentComponent from "./components/AppContentComponent.vue";
const app = createApp(App);

app.provide("trmrkBootstrapApp", trmrkBootstrapApp);
registerServices(app);

registerComponents(app, allComponents);
app.component("AppContentComponent", AppContentComponent);

registerRoutes(app);
app.mount("#app");
