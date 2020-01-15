<template>
    <div class="wrap" ref="wrap">
        <img
            ref="img"
            :src="src"
            class="img"
            :width="imgWidth"
            draggable="false"
            @click="handleVoidClick"
            @contextmenu.prevent="handelContextmenu"
        />

        <div class="label-list" v-show="isHideLabels">
            <div class="label-item"
                v-for="(item,index) in labels"
                :key="item._id"
                ref="label-item"
                :draggable="true"
                @contextmenu.prevent
                @dblclick="handleDoubleClick"
                @click="handleRemoveLabel($event,index)"
                @dragstart="ondragstart($event, index)"
                @dragend="ondragend($event, index)"
                :style="{left:item.left + 'px',top:item.top + 'px'}">
                <span class="label-text" @click.stop @blur="handleDivBlur($event,index)">{{item.text}}</span>
            </div>
        </div>
        <ul class="menu-list" v-show="isShowMenu" ref="menu" @click="hideMenu">
            <li @contextmenu.prevent
                class="menu-item"
                v-for="(item, index) in menus"
                :key="index"
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
                @click="onMenuClick(item)">{{item}}</li>

        </ul>
    </div>
</template>

<script>
    import DomToImg from "dom-to-image";
    const LABEL_INIT_HEIGHT = 30;
    const TRIANGLE_HEIGHT = 5;
    const CLOSE_BTN_BORDER = 6;
    export default {
        name: "ImgLabel",
        props: {
            src: {
                type:String,
                default:""
            },
            width: {
                type: [Number,String],
                default: 500
            },
            theme: {
                type:String,
                default:"#3b8bcc"
            }
        },
        data() {
            return {
                isHideLabels:true,
                isShowMenu:false,
                menus:["新建标签","保存标签","清除标签","隐藏标签","导出为图片"],
                labels:JSON.parse(localStorage.getItem(`_labels_`)) || [],
            }
        },
        computed: {
            imgWidth() {
                return typeof this.width === "number"
                    ? this.width
                    : this.width.slice(0,-2);
            },

        },
        created() {
            this.pos =  {};
            this.dragstart = {};
        },
        mounted() {
            this.$nextTick(() => {
                this.menu = this.$refs.menu;
                this.img = this.$refs.img;
            })
        },
        methods:{
            hideMenu() {
              this.isShowMenu = false;
            },
            showMenu() {
              this.isShowMenu = true;
            },
            handleVoidClick() {
               this.hideMenu();
            },
            handelContextmenu(e) {
                const bouding = e.target.getBoundingClientRect();
                this.showMenu();
                this.$nextTick(() => {
                    const left = Math.min(e.clientX - bouding.left,
                        this.img.offsetWidth - this.menu.offsetWidth);
                    const top = Math.min(e.clientY - bouding.top,
                        this.img.offsetHeight - this.menu.offsetHeight);
                    this.pos["left"] = left;
                    this.pos["top"] =
                        e.clientY - bouding.top + LABEL_INIT_HEIGHT + TRIANGLE_HEIGHT >
                        this.img.offsetHeight
                            ? e.clientY - bouding.top -LABEL_INIT_HEIGHT - TRIANGLE_HEIGHT
                            : e.clientY - bouding.top;
                    this.menu.style.top = top + "px";
                    this.menu.style.left = left + "px";
                })
            },
            onMouseEnter(e) {
                e.target.style.backgroundColor = this.theme;
                e.target.style.color = "#fff";
            },
            onMouseLeave(e) {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#000';
            },
            onMenuClick(item) {
                switch(item) {
                    case "新建标签":
                        this.createdLabel();
                        break;
                    case "保存标签" :
                        this.saveLabel();
                        break;
                    case "清除标签":
                        this.clearLabel();
                        break;
                    case "隐藏标签":
                        this.hideLabel();
                        break;
                    case "导出为图片":
                        this.exportImg();
                        break;
                    default:
                        "";
                }
            },
            createdLabel() {
              this.labels.push({
                  left:this.pos.left,
                  top:this.pos.top,
                  text:"新建标签",
                  _id:new Date().getTime()
              })
            },
            saveLabel() {
              localStorage.setItem(`_labels_`,JSON.stringify(this.labels));
              // this.labels = [];
            },
            clearLabel() {
                localStorage.removeItem(`_labels_`);
                this.labels = [];
            },
            hideLabel() {
                this.isHideLabels = !this.isHideLabels;
                if (!this.labels.length) return;
                this.menus[3] = this.menus[3] === "显示标签" ? "隐藏标签" : "显示标签";
            },
            exportImg() {
                setTimeout(() => {
                    DomToImg.toJpeg(this.$refs.wrap).then(dataUrl => {
                        const link = document.createElement('a');
                        link.href = dataUrl;
                        link.download = this.getData();
                        link.click();
                    })
                })
            },
            handleDivBlur(e,index) {
                e.target.innerHTML === "" && this.labels.splice(index,1);
                e.target.setAttribute("contenteditable",false);
                this.labels[index].text = e.target.innerHTML;
            },
            handleDoubleClick(e) {
                e.target.setAttribute("contenteditable",true);
                e.target.focus();
                this.$nextTick(() => {
                    if (document.selection) {
                        let range = document.body.createTextRange();
                        range.moveToElementText(e.target);
                        range.select();
                    } else if (window.getSelection) {
                        const range = document.createRange();
                        range.selectNodeContents(e.target);
                        window.getSelection().removeAllRanges();
                        window.getSelection().addRange(range);
                    }
                })
            },
            handleRemoveLabel(e,index) {
                this.labels.splice(index,1);
                localStorage.setItem(`_labels_`,JSON.stringify(this.labels));
            },
            ondragstart(e,i) {
                const bouding = this.img.getBoundingClientRect();
                this.dragstart["left"] = e.clientX - bouding.left - this.labels[i].left;
                this.dragstart["top"] = e.clientY - bouding.top - this.labels[i].top;
            },
            ondragend(e,index) {
                const bouding = this.img.getBoundingClientRect();
                const labelWidth = this.$refs['label-item'][index].clientWidth;
                const labelHeight = this.$refs['label-item'][ index].clientHeight;
                this.labels[index].left = Math.max(
                    0,
                    Math.min(
                        e.clientX - bouding.left - this.dragstart.left,
                        bouding.width - labelWidth - CLOSE_BTN_BORDER
                    )
                );
                this.labels[index].top = Math.max(
                    0 + CLOSE_BTN_BORDER,
                    Math.min(
                        e.clientY - bouding.top - this.dragstart.top,
                        bouding.height - labelHeight - TRIANGLE_HEIGHT * 2
                    )
                );
            },
            getData() {
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1 < 10
                    ? `0${date.getMonth() +1}`
                    : date.getMonth() +1;
                const date1 = date.getDate() < 10
                    ? `0${date.getDate()}`
                    : date.getDate();
                return `图片-${year}-${month}-${date1}`;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wrap {
        position: relative;
        display: inline-block;
        border: 1px solid #ccc;
        padding: 0;
        margin: 0;
        background: #fff;
        .img {
            display: block;
        }
        .label-list {
            .label-item {
                position: absolute;
                background: RGBA(0,0,0,0.35);
                color: #fff;
                border-radius: 5px;
                cursor: pointer;
                user-select: none;
                transition: 0.3s all;
                .label-text {
                    display: inline-block;
                    padding: 7px 10px;
                    outline: none;
                }
                &:hover {
                    background: RGBA(0,0,0,0.5);
                    &::after {
                        border-color:RGBA(0,0,0,0.5) RGBA(0,0,0,0) RGBA(0,0,0,0);
                    }
                    &::before {
                        display: block;
                        background: rgba(0,0,0,1);
                    }
                }
                &::after {
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translate(-50%,0);
                    content:' ';
                    display: block;
                    width: 0;
                    height: 0;
                    transition: 0.3s all;
                    border-width: 5px;
                    border-style: solid;
                    border-color: RGBA(0,0,0,0.35) RGBA(0,0,0,0) RGBA(0,0,0,0);
                }
                &::before {
                    position: absolute;
                    display: none;
                    right: -6px;
                    top: -6px;
                    content: 'x';
                    width: 16px;
                    height: 16px;
                    line-height: 12px;
                    font-size: 12px;
                    text-align: center;
                    background: rgba(0,0,0,0.6);
                    border-radius: 50%;
                    transition: 0.3s all;
                }
            }
        }
        .menu-list {
            position: absolute;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            background: #ffffff;
            overflow: hidden;
            padding-left: 0px;
            .menu-item {
                padding: 10px;
                font-size: 14px;
                transition: 0.2s all;
                list-style-type: none;
            }
            .menu-item + .menu-item {
                border-top: 1px solid #cccccc;
            }
        }
    }
</style>
