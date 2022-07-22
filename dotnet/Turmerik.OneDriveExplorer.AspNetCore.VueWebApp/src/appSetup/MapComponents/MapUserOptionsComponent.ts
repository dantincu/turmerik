import { mapComponent } from "../MapComponentsCore";
import { UserOptionsService } from "../../services/UserOptionsService";
import UserOptionsComponent from "../../components/RouteComponents/UserOptionsComponent.vue";
import UserOptionsAppMenuComponent from "../../components/AppMenuComponents/UserOptionsAppMenuComponent.vue";

export const mapUserOptionsComponent = () => {
  mapComponent(
    "UserOptions",
    new UserOptionsService(),
    UserOptionsComponent,
    UserOptionsAppMenuComponent
  );
};
