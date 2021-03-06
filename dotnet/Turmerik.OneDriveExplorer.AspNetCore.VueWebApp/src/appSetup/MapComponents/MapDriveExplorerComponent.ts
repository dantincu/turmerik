import { mapComponent } from "../MapComponentsCore";

import { DriveExplorerService } from "../../services/DriveExplorerService";

import DriveExplorerComponent from "../../components/RouteComponents/DriveExplorerComponent.vue";
import DriveExplorerAppMenuComponent from "../../components/AppMenuComponents/DriveExplorerAppMenuComponent.vue";

export const mapDriveExplorerComponent = (
  driveExplorerService: DriveExplorerService
) => {
  mapComponent(
    "DriveExplorer",
    driveExplorerService,
    DriveExplorerComponent,
    DriveExplorerAppMenuComponent
  );
};
