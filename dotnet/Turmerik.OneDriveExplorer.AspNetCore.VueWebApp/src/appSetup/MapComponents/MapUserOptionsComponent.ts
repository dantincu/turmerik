import { mapComponent } from "../MapComponentsCore";
import { UserOptionsService } from "../../services/UserOptionsService";
import UserOptionsComponent from "../../components/UserOptionsComponent.vue";
import UserOptionsAppMenuComponent from "../../components/UserOptionsAppMenuComponent.vue";

export const mapUserOptionsComponent = () => {
  mapComponent(
    "UserOptions",
    new UserOptionsService(),
    UserOptionsComponent,
    UserOptionsAppMenuComponent
  );
};
