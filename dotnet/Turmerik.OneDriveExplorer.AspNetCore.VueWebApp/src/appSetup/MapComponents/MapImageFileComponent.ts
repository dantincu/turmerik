import { mapComponent } from "../MapComponentsCore";
import { ImageFileService } from "../../services/ImageFileService";
import ImageFileComponent from "../../components/RouteComponents/ImageFileComponent.vue";
import ImageFileAppMenuComponent from "../../components/AppMenuComponents/ImageFileAppMenuComponent.vue";

export const mapImageFileComponent = () => {
  mapComponent(
    "ImageFile",
    new ImageFileService(),
    ImageFileComponent,
    ImageFileAppMenuComponent
  );
};
