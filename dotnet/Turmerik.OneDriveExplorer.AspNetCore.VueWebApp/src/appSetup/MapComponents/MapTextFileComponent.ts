import { mapComponent } from "../MapComponentsCore";
import { TextFileService } from "../../services/TextFileService";
import TextFileComponent from "../../components/RouteComponents/TextFileComponent.vue";
import TextFileAppMenuComponent from "../../components/AppMenuComponents/TextFileAppMenuComponent.vue";

export const mapTextFileComponent = () => {
  mapComponent(
    "TextFile",
    new TextFileService(),
    TextFileComponent,
    TextFileAppMenuComponent
  );
};
