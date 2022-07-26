import { mapComponent } from "../MapComponentsCore";
import { DownloadFileService } from "../../services/DownloadFileService";
import DownloadFileComponent from "../../components/RouteComponents/DownloadFileComponent.vue";
import DownloadFileAppMenuComponent from "../../components/AppMenuComponents/DownloadFileAppMenuComponent.vue";

export const mapDownloadFileComponent = () => {
  mapComponent(
    "DownloadFile",
    new DownloadFileService(),
    DownloadFileComponent,
    DownloadFileAppMenuComponent
  );
};
