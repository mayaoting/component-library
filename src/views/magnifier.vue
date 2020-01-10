<template>
    <Magnifier
            style="padding: 50px; margin: 50px;"
            :boxSize="400"
            :minImgUrl="require('./img/min.jpg')"
            :maxImgUrl="require('./img/max.jpg')"
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
