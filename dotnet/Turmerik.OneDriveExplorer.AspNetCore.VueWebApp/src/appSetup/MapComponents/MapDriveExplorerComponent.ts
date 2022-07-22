import { mapComponent } from "../MapComponentsCore";
import { DriveExplorerService } from "../../services/DriveExplorerService";
import DriveExplorerComponent from "../../components/DriveExplorerComponent.vue";
import DriveExplorerAppMenuComponent from "../../components/DriveExplorerAppMenuComponent.vue";

export const mapDriveExplorerComponent = () => {
  mapComponent(
    "DriveExplorer",
    new DriveExplorerService(),
    DriveExplorerComponent,
    DriveExplorerAppMenuComponent
  );
};
