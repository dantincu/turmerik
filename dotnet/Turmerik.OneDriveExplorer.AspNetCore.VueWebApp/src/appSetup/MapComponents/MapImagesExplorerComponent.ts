import { mapComponent } from "../MapComponentsCore";
import { ImagesExplorerService } from "../../services/ImagesExplorerService";
import ImagesExplorerComponent from "../../components/RouteComponents/ImagesExplorerComponent.vue";
import ImagesExplorerAppMenuComponent from "../../components/AppMenuComponents/ImagesExplorerAppMenuComponent.vue";

export const mapImagesExplorerComponent = () => {
  mapComponent(
    "ImagesExplorer",
    new ImagesExplorerService(),
    ImagesExplorerComponent,
    ImagesExplorerAppMenuComponent
  );
};
