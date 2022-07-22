import { mapComponent } from "../MapComponentsCore";
import { VideoFileService } from "../../services/VideoFileService";
import VideoFileComponent from "../../components/RouteComponents/VideoFileComponent.vue";
import VideoFileAppMenuComponent from "../../components/AppMenuComponents/VideoFileAppMenuComponent.vue";

export const mapVideoFileComponent = () => {
  mapComponent(
    "VideoFile",
    new VideoFileService(),
    VideoFileComponent,
    VideoFileAppMenuComponent
  );
};
