<template>
    <div>
        <div class="magnifier-wrap" ref="wrap">
            <div class="small-wrap" ref="small"
                @mouseenter="onMouseenter"
                @mousemove="onMousemove"
                @mouseleave="onMouseleave">
                <div class="mask-wrap" ref="mask" v-show="isShow"></div>
                <img :src="minImgUrl" :width="boxSize" :height="boxSize">
            </div>
            <div class="max-wrap" ref="maxBox" v-show="isShow">
                <img :src="maxImgUrl" class="img" ref="img"
                    :style="{width:maxImgWidth + 'px',height:maxImgHeight + 'px'}"
                    @load="setMaskSize">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Magnifier",
        props: {
            minImgUrl:{
                type:String,
                default:""
            },
            maxImgUrl:{
                type:String,
                default:""
            },
            boxSize: {
                type:Number,
                default: 500
            },
            autoReverse: {
                type: Boolean,
                default: true
            },
            direction: {
                type: String,
                default: "right"
            }
        },
        data() {
            return{
                isShow:false,
                maxImgWidth:"",
                maxImgHeight:"",
            };
        },
        methods: {
            setMaskSize(e) {
                this.isLoad = true;
                this.maxImgWidth = e.target.width;
                this.maxImgHeight = e.target.height;
                this.$refs.img.width = e.target.width;
                this.$refs.img.height = e.target.height;
                this.$nextTick(() => {
                    this.initDom();
                })
            },
            initDom() {
                this.wrap = this.$refs.wrap;
                this.small = this.$refs.small;
                this.mask = this.$refs.mask;
                this.maxBox = this.$refs.maxBox;
                this.maxImg = this.$refs.img;
                this.smallWidth = this.getDomAttr(this.small,'width');
                this.smallHeight = this.getDomAttr(this.small,'height');
                this.maxBox.style.width = this.boxSize / 1.5 + 'px';
                this.maxBox.style.height = this.boxSize + 'px';
            },
            getDomAttr(el,attr) {
                return parseInt(getComputedStyle(el)[attr].slice(0,-2));
            },
            onMouseenter() {
                this.isShow = true;
            },
            onMousemove(e) {
                if(!this.wrap || !this.isLoad) return;
                const mask = this.$refs.mask;
                const maxImgWidth = this.$refs.img.width;
                const minBoxWidth = this.smallWidth;
                mask.style.width = minBoxWidth * (minBoxWidth / maxImgWidth) / 2 + "px";
                mask.style.height = minBoxWidth * (minBoxWidth / maxImgWidth) / 2 + "px";
                const leftPosition = this.wrap.getBoundingClientRect().left;
                const topPosition = this.wrap.getBoundingClientRect().top;
                const paddingLeft = this.getDomAttr(this.wrap,'padding-left');
                const paddingTop = this.getDomAttr(this.wrap,'padding-top');
                let left = e.clientX - leftPosition - this.mask.offsetWidth / 2;
                let top = e.clientY - topPosition - this.mask.offsetHeight / 2;
                const maxBoxRightPos =
                    leftPosition +
                    this.maxBox.clientLeft +
                    this.small.clientLeft +
                    this.wrap.clientLeft +
                    paddingLeft +
                    this.small.clientWidth;
                const maxBoxLeftPos =
                    leftPosition +
                    this.wrap.clientLeft +
                    paddingLeft -
                    this.small.clientLeft * 2 -
                    this.small.clientWidth;
                let maxBoxPos = -1;
                if (this.autoReverse) {
                    const isMaxBoxExceedWindow =
                        maxBoxRightPos + this.getDomAttr(this.maxBox, "width") >
                        window.innerWidth;
                    maxBoxPos = isMaxBoxExceedWindow ? maxBoxLeftPos : maxBoxRightPos;
                } else {
                    if (this.direction === "right") {
                        maxBoxPos = maxBoxRightPos;
                    } else if (this.direction === "left") {
                        maxBoxPos = maxBoxLeftPos;
                    }
                }
                this.maxBox.style.left = maxBoxPos + "px";
                this.maxBox.style.top =
                    topPosition +
                    this.wrap.clientTop -
                    this.maxBox.clientTop +
                    paddingTop +
                    this.small.clientTop +
                    "px";
                if (left < paddingLeft) {
                    left = paddingLeft;
                } else if (
                    left >
                    this.small.offsetWidth - this.mask.offsetWidth + paddingLeft
                ) {
                    left = this.small.offsetWidth - this.mask.offsetWidth + paddingLeft;
                }
                if (top < paddingTop) {
                    top = paddingTop;
                } else if (
                    top >
                    this.small.offsetHeight - this.mask.offsetHeight + paddingTop
                ) {
                    top = this.small.offsetHeight - this.mask.offsetHeight + paddingTop;
                }
                this.mask.style.left = left + "px";
                this.mask.style.top = top + "px";
                const pX =
                    (left - paddingLeft) / (this.smallWidth - this.mask.offsetWidth);
                const pY =
                    (top - paddingTop) / (this.smallHeight - this.mask.offsetHeight);
                this.maxImg.style.left =
                    -pX * (this.maxImg.width - this.maxBox.offsetWidth) + "px";
                this.maxImg.style.top =
                    -pY * (this.maxImg.height - this.maxBox.offsetHeight) + "px";
            },
            onMouseleave() {
                this.isShow = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .magnifier-wrap {
        position: relative;
        box-sizing: border-box;
        .small-wrap {
            display: inline-block;
            z-index: 1;
            border: 1px solid #ccc;
            box-sizing: border-box;
            .mask-wrap {
                position: absolute;
                cursor: move;
                background: RGBA(255, 255, 255, 0.5);
                z-index: 1;
            }
        }
        .max-wrap {
            position: fixed;
            border: 1px solid #ccc;
            overflow: hidden;
            background: #fff;
            margin-left: 100px;
            .img {
                position: absolute;
            }
        }
    }
</style>
