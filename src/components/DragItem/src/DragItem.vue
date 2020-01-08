<template>
    <div class="drag_item"
         :style="{cursor: !$slots.drag ? 'move': ''}"
        :draggable="!$slots.drag || isDrag"
        @dragstart.stop="onDragstart"
        @dragenter.stop="onDragenter"
        @dragend.stop="onDragend">
        <slot name="drag" />
        <slot />
    </div>
</template>

<script>
    import emitter from "../../../utils/emitter";
    export default {
        name: "DragItem",
        mixins: [emitter],
        data() {
            return {
                isDrag:false,
            }
        },
        mounted() {
            if (this.$slots.drag) {
                this.setSlotAttr();
            }
            this.dispatch('DragWrap', 'putChild', this.$el)
        },
        methods: {
            setSlotAttr() {
                const slotVNode = this.$slots.default.find(
                    vnode => !vnode.data && vnode.text !== ""
                );
                const dragDom = slotVNode.elm.previousSibling;
                if(dragDom.previousSibling !== null) {
                    console.log('具名插槽内只能有一个节点');
                }
                dragDom.addEventListener('mouseenter', () => {
                    this.isDrag = true;
                });
                dragDom.addEventListener('mouseleave', () => {
                    this.isDrag = false;
                });
                dragDom.style.cursor = 'move';
            },
            onDragstart() {
                this.$el.style.opacity = '0.3';
                this.dispatch('DragWrap', 'dragstart', this.$el);
            },
            onDragenter() {
                this.dispatch('DragWrap', 'dragenter', this.$el);
            },
            onDragend () {
                this.$el.style.opacity = '1';
                this.dispatch('DragWrap', 'dragend');
            }
        }
    }
</script>

<style scoped>
.drag_item {
    animation: shake 0.3s;
}
@keyframes shake {
    0% {
        transform: translate3d(-10%,0,0);
    }
    50% {
        transform: translate3d(10%,0,0);
    }
    100% {
        transform: translate3d(0,0,0);
    }
}

</style>
