import { mapComponent } from "../MapComponentsCore";
import { TextFileService } from "../../services/TextFileService";
import TextFileComponent from "../../components/TextFileComponent.vue";
import TextFileAppMenuComponent from "../../components/TextFileAppMenuComponent.vue";

export const mapTextFileComponent = () => {
  mapComponent(
    "TextFile",
    new TextFileService(),
    TextFileComponent,
    TextFileAppMenuComponent
  );
};
