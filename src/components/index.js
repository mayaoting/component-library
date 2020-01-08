import DragWrap from "./DragWrap/src/DragWrap";
import DragItem from "./DragItem/src/DragItem";

const components = [
    DragWrap,
    DragItem
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
    DragItem
}
