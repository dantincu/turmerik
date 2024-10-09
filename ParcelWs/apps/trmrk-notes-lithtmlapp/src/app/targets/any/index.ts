import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../assets";

@customElement("trmrk-app")
export class MyElement extends LitElement {
  static styles = [...globalStyles];

  @property()
  version = "STARTING";

  render() {
    return html`
      <div class="trmrk-app">
        <nav class="navbar navbar-light bg-light">
          <a class="navbar-brand" href="#">Navbar</a>
          <i class="bi-alarm"></i>
          <button class="btn btn-primary">asdf</button>
        </nav>
        <p>Welcome to the Lit tutorial!</p>
        <p>This is the ${this.version} code.</p>
      </div>
    `;
  }
}
