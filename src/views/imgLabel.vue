<template>
    <div style="margin: 50px; padding: 50px; border: 1px solid black;">
        <ImgLabel :width="500" :src="require('../assets/min1.jpg')"></ImgLabel>
    </div>
</template>

<script>
    import ImgLabel from "../components/ImgLabel/src/ImgLabel";
    export default {
        name: "imgLabel",
        components:{
            ImgLabel
        }
    }
</script>

<style scoped>

</style>
