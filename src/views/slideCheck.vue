<template>
    <div class="slider-check-wrap">
<!--        <SlideCheck-->
<!--                :width="300"-->
<!--                :height="300"-->
<!--                :src="src"-->
<!--                @success="success"-->
<!--                @fail="fail"-->
<!--        ></SlideCheck>-->
        <imgCheck></imgCheck>
    </div>
</template>

<script>
    // import SlideCheck from "../components/SlideCheck/src/SlideCheck";
    import imgCheck from "../components/SlideCheck/src/imgCheck";
    export default {
        name: "slideCheck",
        components: {
            // SlideCheck,
            imgCheck
        },
        data() {
            return {
                src:[require('../assets/min1.jpg'),require('../assets/min.jpg')]
            }
        },
        methods: {
            success(pos) {
                console.log(pos);
            },
            fail() {
                console.log('fail');
            }
        }
    }
</script>

<style scoped>

</style>
