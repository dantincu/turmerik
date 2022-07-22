import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

import { registerRoutes, mainComponents } from "./appSetup/RegisterRoutes";

import {
  registerMainComponents,
  registerComponentServices,
  registerNestedComponents,
  registerServices,
} from "./appSetup/MapComponents";

import AppContentComponent from "./components/AppContentComponent.vue";

const app = createApp(App);
registerServices(app);
registerComponentServices(app);

registerMainComponents(app, mainComponents);
registerNestedComponents(app);
app.component("AppContentComponent", AppContentComponent);

registerRoutes(app);
app.mount("#app");
