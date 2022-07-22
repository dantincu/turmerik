import { mapComponent } from "../MapComponentsCore";
import { ImageFileService } from "../../services/ImageFileService";
import ImageFileComponent from "../../components/ImageFileComponent.vue";
import ImageFileAppMenuComponent from "../../components/ImageFileAppMenuComponent.vue";

export const mapImageFileComponent = () => {
  mapComponent(
    "ImageFile",
    new ImageFileService(),
    ImageFileComponent,
    ImageFileAppMenuComponent
  );
};
