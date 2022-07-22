import { mapComponent } from "../MapComponentsCore";
import { AudioFileService } from "../../services/AudioFileService";
import AudioFileComponent from "../../components/AudioFileComponent.vue";
import AudioFileAppMenuComponent from "../../components/AudioFileAppMenuComponent.vue";

export const mapAudioFileComponent = () => {
  mapComponent(
    "AudioFile",
    new AudioFileService(),
    AudioFileComponent,
    AudioFileAppMenuComponent
  );
};
