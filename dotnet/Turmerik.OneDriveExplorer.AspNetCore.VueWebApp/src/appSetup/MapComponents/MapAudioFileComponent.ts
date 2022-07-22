import { mapComponent } from "../MapComponentsCore";
import { AudioFileService } from "../../services/AudioFileService";
import AudioFileComponent from "../../components/RouteComponents/AudioFileComponent.vue";
import AudioFileAppMenuComponent from "../../components/AppMenuComponents/AudioFileAppMenuComponent.vue";

export const mapAudioFileComponent = () => {
  mapComponent(
    "AudioFile",
    new AudioFileService(),
    AudioFileComponent,
    AudioFileAppMenuComponent
  );
};
