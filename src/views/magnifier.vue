<template>
    <Magnifier
            style="padding: 50px; margin: 50px;"
            :boxSize="400"
            :minImgUrl="require('../assets/min1.jpg')"
            :maxImgUrl="require('../assets/max1.jpg')"
    ></Magnifier>
</template>

<script>
    import Magnifier from "../components/Magnifier/src/Magnifier";
    export default {
        name: "magnifier",
        components: {
            Magnifier
        }
    }
</script>

<style scoped>

</style>
