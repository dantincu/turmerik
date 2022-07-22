import { mapComponent } from "../MapComponentsCore";
import { ImagesExplorerService } from "../../services/ImagesExplorerService";
import ImagesExplorerComponent from "../../components/ImagesExplorerComponent.vue";
import ImagesExplorerAppMenuComponent from "../../components/ImagesExplorerAppMenuComponent.vue";

export const mapImagesExplorerComponent = () => {
  mapComponent(
    "ImagesExplorer",
    new ImagesExplorerService(),
    ImagesExplorerComponent,
    ImagesExplorerAppMenuComponent
  );
};
