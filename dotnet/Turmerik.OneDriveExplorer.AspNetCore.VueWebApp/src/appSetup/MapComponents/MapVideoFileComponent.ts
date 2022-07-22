import { mapComponent } from "../MapComponentsCore";
import { VideoFileService } from "../../services/VideoFileService";
import VideoFileComponent from "../../components/VideoFileComponent.vue";
import VideoFileAppMenuComponent from "../../components/VideoFileAppMenuComponent.vue";

export const mapVideoFileComponent = () => {
  mapComponent(
    "VideoFile",
    new VideoFileService(),
    VideoFileComponent,
    VideoFileAppMenuComponent
  );
};
