import { getVarName } from "@/src/trmrk/Reflection/core";
import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";
import TrmrkMultiClickable from "@/src/trmrk-react/components/TrmrkMultiClickable/TrmrkMultiClickable";
import TrmrkIcon from "@/src/trmrk-react/components/TrmrkIcon/TrmrkIcon";

export const ButtonsTestAppBarTypeName = getVarName(() => ButtonsTestAppBar);

export default function ButtonsTestAppBar() {
  return <>
    <TrmrkMultiClickable hoc={{
        component: (hoc) => (props) => <TrmrkBtn borderWidth={1} {...props} hoc={hoc}><TrmrkIcon icon="mdi:home" /></TrmrkBtn>
      }}
      args={hostElem => {
      return ({
        hostElem,
        multiClickPointerDown: (e) => console.log("multiClickPointerDown", e),
        multiClickPressAndHold: (e) => console.log("multiClickPressAndHold", e),
        multiClickComplete: () => console.log("multiClickComplete"),
        multiClickEnded: () => console.log("multiClickEnded")
      });
    }}></TrmrkMultiClickable>
    <h1 className="text-center grow">Buttons Test</h1></>;
}
