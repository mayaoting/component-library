import DragWrap from "./DragWrap/src/DragWrap";
import DragItem from "./DragItem/src/DragItem";
import Magnifier from "./Magnifier/src/Magnifier";
import ImgLabel from "./ImgLabel/src/ImgLabel";

const components = [
    DragWrap,
    DragItem,
    Magnifier,
    ImgLabel
]
// const install = Vue => {
//     if (install.installed) return;
//     components.map(component => Vue.component(component.name, component))
// }

// if (typeof window !== 'undefined' && window.Vue) {
//     install(window.Vue)
// }
export default {
    DragWrap,
    DragItem,
    Magnifier,
    ImgLabel
}
