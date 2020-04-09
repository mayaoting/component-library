<template>
    <div ref="wrap"
        @dragenter.prevent @dragover.prevent>
        <slot />
    </div>
</template>

<script>
    export default {
        name: "DragWrap",   //组件名
        props: {
            data: {
                type:Array,
                default() {
                    return [];
                }
            }
        },
        created() {
            this.toDom = "";   // 拖拽时进入的元素
            this.fromDom = ""; // 拖拽起始的元素
            this.children = []; // 存放所有子组件元素的集合，
            this.$on('dragstart', this.onDragstart);  //子组件会$emit触发dragstart 父组件注册
            this.$on('dragenter', this.onDragenter);
            this.$on('dragend', this.onDragend);
            this.$on('putChild', child => {     //这里的child对应的是子组件的this.$el
                this.children.push(child);         //将所有的子组件的Dom元素收集起来
            });
        },
        methods: {
            onDragstart(el) {
                this.fromDom = el;     //记录拖拽时开始的元素
            },
            onDragenter(el) {
                this.toDom = el;
                if (this.fromDom === this.toDom) {
                    return;
                }
                if(this.isPrevNode(this.fromDom, this.toDom)) {    //判断进入节点是否在起始节点的前面
                    this.$refs.wrap.insertBefore(this.fromDom, this.toDom);   // 将起始节点插入到进入节点之前
                } else {   // 否则就是在之后
                    this.$refs.wrap.insertBefore(this.fromDom, this.toDom.nextSibling)
                    // 将起始节点插入到进入节点之前的下一个兄弟节点的前面
                }
            },
            onDragend(el) {
                if(!this.data.length) return;
                const realDomOrder = [...this.$el.children].filter(child => {
                    child.classList.contains('drag_item');
                })
                this.getDataOrder(realDomOrder,this.children);
            },
            isPrevNode(from, to) {    // to 是否在 from 的前面
                while(from.previousSibling !== null) {
                    if (from.previousSibling === to) {
                        return true;
                    }
                    from = from.previousSibling;
                }
            },
            getDataOrder(realList,dragAfterList) {
                const order = realList.map(realItem => {
                    return dragAfterList.findIndex(dragItem => realItem === dragItem);
                });
                const newData = [];
                order.forEach((item,i) => {
                    newData[i] = this.data[item];
                });
                this.$emit('watchData', newData);
            }
        }
    }
</script>

<style scoped>

</style>
