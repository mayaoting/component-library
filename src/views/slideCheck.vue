<template>
  <div class="slider-check-wrap">
    <SlideCheck :width="300" :height="300" :src="src" @success="success" @fail="fail"></SlideCheck>
  </div>
</template>

<script>
import SlideCheck from "../components/SlideCheck/src/SlideCheck";
export default {
  name: "slideCheck",
  components: {
    SlideCheck
  },
  data() {
    return {
      src: [require("../assets/min1.jpg"), require("../assets/min.jpg")]
    };
  },
  methods: {
    success(pos) {
      console.log(pos);
    },
    fail() {
      console.log("fail");
    }
  }
};
</script>

<style scoped>
</style>
