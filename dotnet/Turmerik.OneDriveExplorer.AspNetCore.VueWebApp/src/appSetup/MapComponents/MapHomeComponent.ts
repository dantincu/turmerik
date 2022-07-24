import { mapComponent } from "../MapComponentsCore";
import { HomeService } from "../../services/HomeService";
import HomeComponent from "../../components/RouteComponents/HomeComponent.vue";
import HomeAppMenuComponent from "../../components/AppMenuComponents/HomeAppMenuComponent.vue";

export const mapHomeComponent = () => {
  mapComponent(
    "UserOptions",
    new HomeService(),
    HomeComponent,
    HomeAppMenuComponent
  );
};
